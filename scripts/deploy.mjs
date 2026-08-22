#!/usr/bin/env node
/**
 * deploy — GitHub repo, Vercel project, production deploy, custom domain, DNS.
 * One command, no dashboard clicks.
 *
 *   npm run deploy -- --domain acme.com
 *   npm run deploy -- --domain acme.com --project acme-site --repo acme-site
 *   npm run deploy -- --domain acme.com --dry        # plan only, no side effects
 *   npm run deploy                                    # deploy, no domain attached
 *
 * Reads .env: GITHUB_TOKEN, VERCEL_TOKEN, OPENAI_API_KEY, VERCEL_SCOPE,
 * DNS_PROVIDER + that provider's credentials.
 *
 * Every step is idempotent. Re-running after a failure resumes rather than
 * duplicating: repos, projects, domains and DNS records are all upserts.
 */
import { execFileSync } from "node:child_process";
import { rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readEnv, root, mask } from "./lib/env.mjs";
import { GitHub, scrub } from "./lib/github.mjs";
import { Vercel, requiredRecords } from "./lib/vercel.mjs";
import { pickProvider } from "./lib/dns.mjs";
import { commitAll, buildExport, pushExport } from "./lib/export.mjs";

/* ── args ─────────────────────────────────────────────────────────────────── */
const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);
const DRY = has("dry");
const SKIP_BUILD = has("skip-build");

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const env = readEnv();
const secrets = [env.GITHUB_TOKEN, env.VERCEL_TOKEN, env.OPENAI_API_KEY, env.GODADDY_API_SECRET, env.CLOUDFLARE_API_TOKEN, env.NAMECHEAP_API_KEY].filter(Boolean);
const say = (label, msg) => console.log(`  ${c.dim(label.padEnd(10))}${scrub(msg, ...secrets)}`);
const die = (msg) => { console.error(`\n${c.red("deploy failed:")} ${scrub(msg, ...secrets)}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── derive names ─────────────────────────────────────────────────────────── */
const brandName = (() => {
  try { return (readFileSync(join(root, "brand.config.ts"), "utf8").match(/name:\s*"([^"]+)"/) || [])[1] || null; }
  catch { return null; }
})();
const slugify = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const DOMAIN = flag("domain")?.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase() || null;
const NAME = slugify(flag("project") || flag("repo") || brandName || DOMAIN?.split(".")[0] || "new-site");
const REPO = slugify(flag("repo") || NAME);
const PRIVATE = !has("public");
const WITH_WWW = DOMAIN && !DOMAIN.startsWith("www.") && !has("no-www");
/** Apex of the domain, for splitting "www.acme.com" into zone "acme.com" + host "www". */
const ZONE = flag("zone") || (DOMAIN ? DOMAIN.split(".").slice(-2).join(".") : null);

console.log(`\n${c.bold("deploy")} ${c.dim(DRY ? "(dry run, no side effects)" : "")}`);
say("project", c.cyan(NAME));
say("repo", c.cyan(REPO) + c.dim(PRIVATE ? " (private)" : " (public)"));
say("domain", DOMAIN ? c.cyan(DOMAIN) + (WITH_WWW ? c.dim(` + www.${DOMAIN}`) : "") : c.dim("none, vercel.app only"));
console.log();

/* ── 0. preflight ─────────────────────────────────────────────────────────── */
if (!existsSync(join(root, ".git"))) die("not a git repo. Run `git init` first.");
if (!env.GITHUB_TOKEN) die("GITHUB_TOKEN missing from .env");
if (!env.VERCEL_TOKEN) die("VERCEL_TOKEN missing from .env");
if (!env.OPENAI_API_KEY) {
  console.log(`  ${c.yellow("warn")}      OPENAI_API_KEY not in .env — the FAQ widget will return 500 on the deployed site.`);
}

const gh = new GitHub(env.GITHUB_TOKEN);
let teamId = null;
try { teamId = await Vercel.resolveScope(env.VERCEL_TOKEN, env.VERCEL_SCOPE || null); }
catch (e) { die(e.message); }
const vc = new Vercel(env.VERCEL_TOKEN, teamId);

let me, vme;
try { me = await gh.whoami(); } catch (e) { die(`GitHub token rejected: ${e.message}`); }
try { vme = await vc.get("/v2/user"); } catch (e) { die(`Vercel token rejected: ${e.message}`); }
say("github", `${c.cyan(me.login)} ${c.dim(mask(env.GITHUB_TOKEN))}`);
say("vercel", `${c.cyan(vme.user.username)}${teamId ? c.dim(` scope=${env.VERCEL_SCOPE}`) : c.dim(" scope=personal")}`);

const dnsProvider = DOMAIN ? pickProvider(env) : null;
if (DOMAIN) {
  if (!dnsProvider) {
    console.log(`  ${c.yellow("warn")}      no DNS credentials in .env, so the record must be written by hand.`);
    console.log(`  ${c.dim("          ")}add one of: GODADDY_API_KEY+GODADDY_API_SECRET, CLOUDFLARE_API_TOKEN, NAMECHEAP_*`);
  } else {
    const ready = dnsProvider.credentials().every((k) => env[k]);
    say("dns", `${c.cyan(dnsProvider.name)}${ready ? "" : c.yellow(" (credentials incomplete)")}`);
  }
}

/* ── 1. security gate ─────────────────────────────────────────────────────── */
/*
 * Runs BEFORE the build and before anything leaves the machine. A committed
 * token, an SVG carrying script, an executable in public/, or a dependency that
 * started running install scripts all stop the deploy here — the point of no
 * return is the force-push, so the check has to be upstream of it.
 */
if (!has("skip-guard")) {
  try {
    execFileSync("node", ["scripts/guard.mjs", "--json"], { cwd: root, stdio: "pipe", encoding: "utf8" });
    say("guard", c.green("clean"));
  } catch (e) {
    let report = null;
    try { report = JSON.parse(e.stdout || "{}"); } catch { /* fall through */ }
    const blocks = (report?.findings || []).filter((f) => f.level === "block");
    if (!blocks.length) {
      say("guard", c.yellow("scan could not run") + c.dim(" — run `npm run guard` by hand"));
    } else {
      console.error(`\n${c.red("deploy blocked by guard:")}`);
      for (const f of blocks) {
        console.error(`  ${c.red("BLOCK")}  ${c.dim(f.check.padEnd(8))}${scrub(f.msg, ...secrets)}`);
        if (f.fix) console.error(`         ${c.dim(f.check.padEnd(8))}${c.dim("fix: " + f.fix)}`);
      }
      console.error(`\n${c.dim("Run `npm run guard` for the full report. --skip-guard overrides, but do not.")}\n`);
      process.exit(1);
    }
  }
}

/* ── 2. local build gate ──────────────────────────────────────────────────── */
if (!SKIP_BUILD && !DRY) {
  say("build", "npm run build ...");
  try {
    execFileSync("npm", ["run", "build"], { cwd: root, stdio: "pipe", encoding: "utf8" });
  } catch (e) {
    const out = `${e.stdout || ""}${e.stderr || ""}`;
    const line = out.split("\n").find((l) => /error|Error|failed/i.test(l)) || out.split("\n").slice(-3).join(" ");
    die(`the local build fails, so the deploy would fail too.\n  ${line.trim()}\n\nRun \`npm run build\` to see it all, or \`/run\` to have it fixed.`);
  }
  try { execFileSync("npm", ["run", "verify"], { cwd: root, stdio: "pipe" }); }
  catch { console.log(`  ${c.yellow("warn")}      npm run verify failed — the build emitted no stylesheet or a page does not link it.`); }
  say("build", c.green("green"));
}

/* ── 3. GitHub repo ───────────────────────────────────────────────────────── */
let repoInfo;
if (DRY) {
  const existing = await gh.findRepo(flag("owner") || me.login, REPO);
  say("repo", existing ? c.dim("exists, would force-push") : c.dim("would create"));
  repoInfo = { owner: flag("owner") || me.login, repo: { full_name: `${flag("owner") || me.login}/${REPO}` } };
} else {
  try {
    repoInfo = await gh.ensureRepo(REPO, { owner: flag("owner"), private: PRIVATE, description: brandName ? `${brandName} website` : "" });
    say("repo", `${c.cyan(repoInfo.repo.full_name)} ${c.dim(repoInfo.created ? "created" : "exists")}`);
  } catch (e) { die(`could not create the repo: ${e.message}`); }
}

/* ── 4. commit + clean export + push ──────────────────────────────────────── */
let commitSha = null;
if (DRY) {
  say("push", c.dim("would commit, strip factory tooling, force-push main"));
} else {
  try {
    const { committed, files } = commitAll(root, `Build ${brandName || NAME}`);
    say("commit", committed ? `${files} file(s)` : c.dim("clean"));
  } catch (e) { die(e.message); }

  let work;
  try { work = buildExport(root); } catch (e) { die(e.message); }
  try {
    commitSha = pushExport(work, gh.pushUrl(repoInfo.owner, REPO));
    say("push", `${c.green("force-pushed")} ${c.dim(commitSha.slice(0, 7))} ${c.dim("(factory tooling stripped)")}`);
  } catch (e) {
    die(`push failed: ${e.message}`);
  } finally { rmSync(work, { recursive: true, force: true }); }
}

/* ── 5. Vercel project ────────────────────────────────────────────────────── */
let project;
if (DRY) {
  project = await vc.findProject(NAME);
  say("vercel", project ? c.dim("project exists") : c.dim("would create project + link repo"));
} else {
  try {
    const r = await vc.ensureProject(NAME, `${repoInfo.owner}/${REPO}`);
    project = r.project;
    say("vercel", `${c.cyan(project.name)} ${c.dim(r.created ? "created" : "exists")} ${c.dim(project.id)}`);
  } catch (e) { die(`could not create the Vercel project: ${e.message}`); }

  for (const key of ["OPENAI_API_KEY", "OPENAI_MODEL"]) {
    if (!env[key]) continue;
    try { await vc.setEnv(project.id, key, env[key]); say("env", `${key} ${c.dim("set on project")}`); }
    catch (e) { console.log(`  ${c.yellow("warn")}      could not set ${key}: ${scrub(e.message, ...secrets)}`); }
  }
}

/* ── 6. production deploy ─────────────────────────────────────────────────── */
let deployUrl = null;
if (DRY) {
  say("deploy", c.dim("would trigger a production deploy from the pushed commit"));
} else {
  say("deploy", "building on Vercel ...");
  const args = ["vercel@latest", "deploy", "--prod", "--yes", "--token", env.VERCEL_TOKEN, "--cwd", root];
  if (env.VERCEL_SCOPE) args.push("--scope", env.VERCEL_SCOPE);
  // vercel link writes .vercel/ so the CLI targets THIS project, never a cached one.
  try {
    const linkArgs = ["vercel@latest", "link", "--yes", "--project", NAME, "--token", env.VERCEL_TOKEN, "--cwd", root];
    if (env.VERCEL_SCOPE) linkArgs.push("--scope", env.VERCEL_SCOPE);
    execFileSync("npx", linkArgs, { cwd: root, stdio: "pipe", encoding: "utf8" });
    const out = execFileSync("npx", args, { cwd: root, stdio: "pipe", encoding: "utf8" });
    deployUrl = (out.match(/https:\/\/[^\s]+\.vercel\.app/g) || []).pop() || null;
    say("deploy", `${c.green("live")} ${c.cyan(deployUrl || "(url not parsed)")}`);
  } catch (e) {
    const out = scrub(`${e.stdout || ""}${e.stderr || ""}`, ...secrets);
    die(`vercel deploy failed.\n  ${out.split("\n").filter(Boolean).slice(-4).join("\n  ")}`);
  }
}

/* ── 7. domain + DNS ──────────────────────────────────────────────────────── */
if (DOMAIN) {
  const hosts = [DOMAIN, ...(WITH_WWW ? [`www.${DOMAIN}`] : [])];
  for (const host of hosts) {
    if (DRY) {
      const cfg = await vc.domainConfig(host).catch(() => ({}));
      const recs = requiredRecords(host, cfg, ZONE);
      say("domain", `${c.cyan(host)} ${c.dim("would attach; record")} ${recs.map((r) => `${r.type} ${r.name} -> ${r.value}`).join(", ")}`);
      continue;
    }
    try {
      const added = await vc.addDomain(project.id, host);
      say("domain", `${c.cyan(host)} ${c.dim(added?.alreadyAttached ? "already attached" : "attached")}`);
    } catch (e) {
      console.log(`  ${c.yellow("warn")}      ${host}: ${scrub(e.message, ...secrets)}`);
      continue;
    }

    const cfg = await vc.domainConfig(host).catch(() => ({}));
    const recs = requiredRecords(host, cfg, ZONE);

    // The vercel adapter can only write records for a zone Vercel actually hosts.
    // If the nameservers point elsewhere the write 403s, or worse, succeeds into a
    // zone nobody resolves — so refuse and name the real registrar instead.
    if (dnsProvider?.name === "vercel" && cfg.serviceType && cfg.serviceType !== "zeit.world") {
      console.log(`  ${c.red("dns")}       ${host} nameservers are NOT delegated to Vercel (serviceType=${cfg.serviceType}).`);
      console.log(`  ${c.dim("          ")}Set DNS_PROVIDER=godaddy (or cloudflare/namecheap) in .env plus that provider's keys,`);
      console.log(`  ${c.dim("          ")}or delegate the nameservers to Vercel: ${(cfg.nameservers || []).join(" ") || "see the Vercel domain card"}`);
      for (const r of recs) console.log(`  ${c.yellow("todo")}      add at your registrar: ${r.type}  ${r.name}  ->  ${r.value}`);
      continue;
    }
    if (!dnsProvider) {
      for (const r of recs) console.log(`  ${c.yellow("todo")}      add at your registrar: ${r.type}  ${r.name}  ->  ${r.value}`);
      continue;
    }
    for (const r of recs) {
      try {
        await dnsProvider.upsert(env, { zone: ZONE, ...r });
        say("dns", `${c.green("wrote")} ${r.type} ${c.cyan(r.name === "@" ? ZONE : `${r.name}.${ZONE}`)} -> ${r.value} ${c.dim(`via ${dnsProvider.name}`)}`);
      } catch (e) {
        console.log(`  ${c.red("dns")}       ${r.type} ${r.name}: ${scrub(e.message, ...secrets)}`);
      }
    }
  }

  /* poll until Vercel stops calling it misconfigured */
  if (!DRY) {
    say("verify", "waiting for DNS to propagate ...");
    const deadline = Date.now() + 180_000;
    const pending = new Set(hosts);
    while (pending.size && Date.now() < deadline) {
      for (const host of [...pending]) {
        const cfg = await vc.domainConfig(host).catch(() => null);
        if (cfg && cfg.misconfigured === false) {
          pending.delete(host);
          say("verify", `${c.green("ok")} ${c.cyan(host)}`);
        }
      }
      if (pending.size) await sleep(6000);
    }
    for (const host of pending) {
      console.log(`  ${c.yellow("verify")}    ${host} still propagating. Vercel picks it up on its own, usually inside 10 min.`);
    }
  }
}

/* ── done ─────────────────────────────────────────────────────────────────── */
const web = `https://github.com/${repoInfo?.owner || me.login}/${REPO}`;
console.log();
if (DRY) {
  console.log(`${c.dim("dry run complete, nothing changed.")}\n`);
} else {
  console.log(`${c.green("shipped")}`);
  say("repo", c.cyan(web));
  if (deployUrl) say("preview", c.cyan(deployUrl));
  if (DOMAIN) say("live", c.cyan(`https://${DOMAIN}`));
  console.log();
}
