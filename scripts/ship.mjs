#!/usr/bin/env node
/**
 * ship — push the finished site to a GitHub repo YOU created, and nothing else.
 *
 *   npm run ship -- https://github.com/you/acme-site.git
 *   npm run ship -- git@github.com:you/acme-site.git --dry
 *   npm run ship                 # reuses the existing `origin`
 *
 * No tokens, no GitHub API, no Vercel. You create the repo in the GitHub UI, paste
 * the URL here, then import the repo in the Vercel dashboard yourself.
 *
 * What gets pushed is a CLEAN EXPORT: the factory tooling (.claude/, scripts/,
 * .scrape/, CLAUDE.md, AGENTS.md) is stripped from the pushed copy. Your local repo,
 * files, and history are untouched.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const remoteArg = argv.find((a) => /^(https?:\/\/|git@).+/.test(a)) || null;
const BRANCH = "main";

// Everything the client repo has no business containing.
const STRIP = [".claude", ".scrape", "CLAUDE.md", "AGENTS.md", "scripts", "ideas"];
const FACTORY_SCRIPTS = ["brand", "check", "clone", "ship", "up"];

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const git = (args, opts = {}) =>
  execFileSync("git", args, { cwd: opts.cwd || root, encoding: "utf8", stdio: opts.quiet ? "pipe" : ["pipe", "pipe", "pipe"] }).trim();
const tryGit = (args, opts) => { try { return git(args, opts); } catch { return null; } };
const die = (msg) => { console.error(`\n${c.red("ship failed:")} ${msg}\n`); process.exit(1); };

console.log(`\n${c.bold("ship")} ${c.dim(DRY ? "(dry run, no side effects)" : "")}\n`);

if (!existsSync(join(root, ".git"))) die("not a git repo. Run `git init` first.");

// ── 1. resolve the remote ────────────────────────────────────────────────────
const existing = tryGit(["remote", "get-url", "origin"]);
const remote = remoteArg || existing;
if (!remote) {
  die("no remote. Create the repo on GitHub, then run:\n  npm run ship -- https://github.com/you/repo.git");
}
if (remoteArg && existing && existing !== remoteArg) {
  console.log(`  ${c.dim("origin")}    ${existing} ${c.dim("->")} ${c.cyan(remoteArg)}`);
  if (!DRY) git(["remote", "set-url", "origin", remoteArg]);
} else if (remoteArg && !existing) {
  console.log(`  ${c.dim("origin")}    ${c.cyan(remoteArg)} ${c.dim("(added)")}`);
  if (!DRY) git(["remote", "add", "origin", remoteArg]);
} else {
  console.log(`  ${c.dim("origin")}    ${c.cyan(remote)}`);
}

// ── 2. commit local work so the export has something to read ─────────────────
const dirty = git(["status", "--porcelain"]);
if (dirty) {
  console.log(`  ${c.dim("commit")}    ${dirty.split("\n").length} changed file(s)`);
  if (!DRY) {
    const before = tryGit(["rev-parse", "HEAD"]);
    git(["add", "-A"]);
    // Explicit identity so a machine with no git config still commits, and a hard
    // failure if it does not: `git archive HEAD` below would silently push the OLD
    // tree, which deploys a site missing the new components and stylesheet.
    tryGit(["-c", "user.name=ship", "-c", "user.email=ship@local", "commit", "-m", "Build site"]);
    const after = tryGit(["rev-parse", "HEAD"]);
    if (after === before) {
      die("the commit did not land, so the push would ship the previous tree.\n" +
        `Run \`git commit\` by hand and read the error (a pre-commit hook or missing identity is usual).\n${git(["status", "--short"])}`);
    }
  }
} else {
  console.log(`  ${c.dim("commit")}    clean`);
}
if (tryGit(["rev-parse", "HEAD"]) === null) die("no commits yet. Commit something first.");
const branch = tryGit(["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== BRANCH && !DRY) tryGit(["branch", "-M", BRANCH]);

// ── 3. clean export: strip the factory tooling, then force-push that copy ─────
console.log(`  ${c.dim("strip")}     ${STRIP.join(" ")} ${c.dim("(pushed copy only)")}`);
if (DRY) {
  console.log(`  ${c.dim("push")}      ${c.dim(`(dry run) would force-push stripped HEAD to ${remote} ${BRANCH}`)}`);
} else {
  const work = mkdtempSync(join(tmpdir(), "ship-"));
  try {
    // git archive gives us exactly the committed tree, no node_modules, no .next
    execFileSync("sh", ["-c", `git archive HEAD | tar -x -C '${work}'`], { cwd: root, stdio: "pipe" });
    for (const p of STRIP) rmSync(join(work, p), { recursive: true, force: true });

    // drop factory-only npm scripts so the pushed package.json has no dead entries
    const pkgPath = join(work, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      for (const k of FACTORY_SCRIPTS) delete pkg.scripts?.[k];
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }

    // The export must still be buildable. A missing PostCSS config or a Tailwind
    // dep left in devDependencies deploys a site that renders with no CSS.
    for (const required of ["package.json", "postcss.config.mjs", "app/globals.css", "app/layout.tsx", "next.config.ts"]) {
      if (!existsSync(join(work, required))) die(`the export is missing ${required}. Is it committed and not gitignored?`);
    }
    const exported = JSON.parse(readFileSync(join(work, "package.json"), "utf8"));
    const cssDeps = ["tailwindcss", "@tailwindcss/postcss", "typescript"].filter((d) => !exported.dependencies?.[d]);
    if (cssDeps.length) {
      die(`${cssDeps.join(" and ")} must live in "dependencies", not "devDependencies".\n` +
        "Vercel skips devDependencies whenever NODE_ENV=production is set on the project. Without them the build\n" +
        "either fails on unresolved @/ imports or ships with no CSS.");
    }
    if (!readFileSync(join(work, "app", "layout.tsx"), "utf8").includes("globals.css")) {
      die("app/layout.tsx does not import ./globals.css, so the deployed site would have no stylesheet.");
    }

    git(["init", "-q", "-b", BRANCH], { cwd: work });
    git(["add", "-A"], { cwd: work });
    git(["-c", "user.name=ship", "-c", "user.email=ship@local", "commit", "-q", "-m", "Deploy site"], { cwd: work });
    git(["remote", "add", "origin", remote], { cwd: work });
    console.log(`  ${c.dim("push")}      force-pushing to ${BRANCH} ...`);
    execFileSync("git", ["push", "-f", "origin", BRANCH], { cwd: work, stdio: "inherit" });
  } catch (err) {
    die(`push failed. ${err.message.split("\n")[0]}\nCheck the remote URL and that your git credentials can write to it.`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

const webUrl = remote.replace(/^git@github\.com:/, "https://github.com/").replace(/\.git$/, "");
if (DRY) {
  console.log(`\n${c.dim("dry run complete, nothing was pushed.")} ${c.cyan(webUrl)}\n`);
} else {
  console.log(`\n${c.green("pushed")}  ${c.cyan(webUrl)}`);
  console.log(`${c.dim("next:")}  import that repo at vercel.com/new, add OPENAI_API_KEY there, then attach the domain.\n`);
}
