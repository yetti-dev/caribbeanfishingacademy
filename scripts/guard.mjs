#!/usr/bin/env node
/**
 * guard — supply-chain and malware scan for this repo.
 *
 *   npm run guard              scan, non-zero exit on a BLOCK finding
 *   npm run guard -- --strict  warnings block too
 *   npm run guard -- --json    machine-readable
 *   npm run guard -- --allow-install-scripts   record today's install scripts as approved
 *
 * Five checks, in the order an attack actually reaches you:
 *
 *   deps    npm install runs code. postinstall is the most-abused malware hook
 *           (Shai-Hulud, axios 1.14.1). Any NEW install script, any tarball from
 *           outside the registry, any missing integrity hash blocks the deploy.
 *   secrets a token committed to the repo is a token you must rotate.
 *   code    vendored blocks and generated components are third-party code.
 *           eval, obfuscated blobs, runtime <script> injection, child_process.
 *   assets  everything in public/ is served from your domain. Executables
 *           disguised as images, and SVGs carrying active content.
 *   scrape  .scrape/ markdown is untrusted text that AGENTS READ. Prompt
 *           injection there is an attack on the build, not on the visitor.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { root } from "./lib/env.mjs";
import {
  SECRET_PATTERNS, CODE_PATTERNS, INJECTION_PATTERNS, scanText,
  sniffType, svgIsClean, EXECUTABLE_TYPES, RASTER_TYPES,
} from "./lib/security.mjs";

const argv = process.argv.slice(2);
const STRICT = argv.includes("--strict");
const JSON_OUT = argv.includes("--json");
const RECORD = argv.includes("--allow-install-scripts");

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const findings = [];
const block = (check, msg, fix) => findings.push({ level: "block", check, msg, fix });
const warn = (check, msg, fix) => findings.push({ level: "warn", check, msg, fix });
const note = (check, msg) => findings.push({ level: "note", check, msg });

const ALLOWLIST = join(root, ".security", "allowed-install-scripts.json");
const MAX_ASSET_BYTES = 400 * 1024;   // CLAUDE.md's own limit for public/
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "out", "coverage", ".vercel"]);

/** Every file git knows about, so ignored junk is never scanned. */
function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
      .split("\0").filter(Boolean);
  } catch { return []; }
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".scrape") continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/* ── 1. dependencies ──────────────────────────────────────────────────────── */
function checkDeps() {
  const lockPath = join(root, "package-lock.json");
  if (!existsSync(lockPath)) {
    block("deps", "no package-lock.json, so dependency versions are unpinned and unverifiable",
      "commit the lockfile: npm install && git add package-lock.json");
    return;
  }
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  const packages = lock.packages || {};

  const installScripts = [];
  const offRegistry = [];
  const noIntegrity = [];

  for (const [path, meta] of Object.entries(packages)) {
    if (!path) continue; // "" is the root project
    const name = path.replace(/^.*node_modules\//, "");
    if (meta.hasInstallScript) installScripts.push(name);
    const res = meta.resolved || "";
    if (res && !/^https:\/\/registry\.npmjs\.org\//.test(res)) offRegistry.push(`${name} <- ${res}`);
    if (res && !meta.integrity && !meta.link) noIntegrity.push(name);
  }

  let approved = [];
  if (existsSync(ALLOWLIST)) {
    try { approved = JSON.parse(readFileSync(ALLOWLIST, "utf8")).approved || []; } catch { /* treat as empty */ }
  }
  if (RECORD) {
    writeFileSync(ALLOWLIST, JSON.stringify({
      note: "Packages permitted to run install scripts. Adding one means you reviewed it. Regenerate with: npm run guard -- --allow-install-scripts",
      approved: [...installScripts].sort(),
    }, null, 2) + "\n");
    note("deps", `recorded ${installScripts.length} install script(s) as approved in .security/`);
    approved = installScripts;
  }

  const unapproved = installScripts.filter((n) => !approved.includes(n));
  if (unapproved.length) {
    block("deps", `${unapproved.length} dependency(ies) run install scripts and are NOT approved: ${unapproved.join(", ")}`,
      "review each one, then: npm run guard -- --allow-install-scripts");
  } else if (installScripts.length) {
    note("deps", `${installScripts.length} install script(s), all approved`);
  }
  if (offRegistry.length) {
    block("deps", `${offRegistry.length} package(s) resolve outside the npm registry: ${offRegistry.slice(0, 3).join("; ")}`,
      "a git or http tarball dependency bypasses registry scanning. Replace it with a registry version.");
  }
  if (noIntegrity.length) {
    block("deps", `${noIntegrity.length} package(s) have no integrity hash: ${noIntegrity.slice(0, 5).join(", ")}`,
      "delete node_modules and package-lock.json, then npm install");
  }

  // npm audit. Advisory data changes daily, so this warns rather than blocks
  // unless something is critical.
  try {
    const out = execFileSync("npm", ["audit", "--json", "--audit-level=low"], { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    summariseAudit(JSON.parse(out));
  } catch (e) {
    // npm audit exits non-zero when it finds anything; the JSON is still on stdout.
    try { summariseAudit(JSON.parse(e.stdout || "{}")); }
    catch { warn("deps", "npm audit could not run (offline?)", "run npm audit by hand before shipping"); }
  }
}

function summariseAudit(report) {
  const v = report?.metadata?.vulnerabilities;
  if (!v) return;
  const { critical = 0, high = 0, moderate = 0, low = 0 } = v;
  if (critical) block("deps", `npm audit: ${critical} critical vulnerability(ies)`, "npm audit fix, or pin a patched version");
  if (high) warn("deps", `npm audit: ${high} high severity`, "npm audit fix");
  if (moderate || low) note("deps", `npm audit: ${moderate} moderate, ${low} low`);
  if (!critical && !high && !moderate && !low) note("deps", "npm audit clean");
}

/* ── 2. secrets ───────────────────────────────────────────────────────────── */
function checkSecrets() {
  // .env must be untracked AND ignored. Either alone is not enough.
  try {
    const tracked = execFileSync("git", ["ls-files", "--error-unmatch", ".env"], { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    if (tracked.trim()) block("secrets", ".env is TRACKED BY GIT — every token in it is in your history", "git rm --cached .env, then rotate every key it holds");
  } catch { /* not tracked, which is correct */ }

  const files = trackedFiles().filter((f) => !/\.(png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|mp4|webm|pdf)$/i.test(f));
  let scanned = 0;
  for (const rel of files) {
    const abs = join(root, rel);
    if (!existsSync(abs)) continue;
    if (statSync(abs).size > 2 * 1024 * 1024) continue;
    // The pattern list itself contains regexes that look like keys.
    if (rel === "scripts/lib/security.mjs" || rel === ".env.example") continue;
    scanned++;
    const hits = scanText(readFileSync(abs, "utf8"), SECRET_PATTERNS);
    for (const h of hits) {
      block("secrets", `${rel}:${h.line} looks like a committed ${h.name}`, "remove it, then ROTATE that credential — assume it is compromised");
    }
  }
  note("secrets", `${scanned} tracked text file(s) scanned`);
}

/* ── 3. application + vendored code ───────────────────────────────────────── */
function checkCode() {
  const dirs = ["app", "components", "content", "lib"].map((d) => join(root, d));
  const files = dirs.flatMap((d) => walk(d)).filter((f) => /\.(tsx?|jsx?|mjs|cjs|css)$/.test(f));
  let flagged = 0;
  for (const abs of files) {
    const rel = relative(root, abs);
    const src = readFileSync(abs, "utf8");
    /*
     * Server code may legitimately touch the filesystem (app/api/chat reads
     * content/knowledge.md). Client code may not — that would be a bundler
     * error at best and an exfiltration path at worst. So the fs rule only
     * applies to modules that actually ship to the browser.
     */
    const isClient = /^\s*["']use client["']/m.test(src);
    const serverOnly = rel.startsWith("app/api/") || (!isClient && !rel.startsWith("components/"));
    const hits = scanText(src, CODE_PATTERNS)
      .filter((h) => !(h.name === "node:fs write from app code" && serverOnly));
    for (const h of hits) {
      flagged++;
      const msg = `${rel}:${h.line} ${h.name} ${c.dim(`— ${h.excerpt}`)}`;
      if (h.sev === "high") block("code", msg, "third-party or generated code should not need this. Remove it or justify it in a comment.");
      else if (h.sev === "med") warn("code", msg, "confirm this is deliberate and the input is trusted");
      else note("code", msg);
    }
  }
  if (!flagged) note("code", `${files.length} source file(s) clean`);
}

/* ── 4. served assets ─────────────────────────────────────────────────────── */
function checkAssets() {
  const files = walk(join(root, "public"));
  let heavy = 0;
  for (const abs of files) {
    const rel = relative(root, abs);
    const size = statSync(abs).size;
    const buf = readFileSync(abs, { encoding: null }).subarray(0, 4096);
    const sniffed = sniffType(buf);
    const ext = extname(abs).toLowerCase();

    if (sniffed && EXECUTABLE_TYPES.has(sniffed)) {
      block("assets", `${rel} is a ${sniffed}, not an image, and public/ is served from your domain`, "delete it");
      continue;
    }
    if (ext === ".svg" || sniffed === "svg") {
      const full = readFileSync(abs, "utf8");
      const { clean, findings: bad } = svgIsClean(full);
      if (!clean) {
        block("assets", `${rel} is an SVG carrying active content (${bad.join(", ")}) — same-origin stored XSS`, "delete it, or re-run npm run clone which now sanitises SVGs");
        continue;
      }
    } else if (sniffed && !RASTER_TYPES.has(sniffed) && ext !== ".txt" && ext !== ".xml" && ext !== ".json") {
      warn("assets", `${rel} sniffs as ${sniffed} but has extension ${ext || "(none)"}`, "confirm the file is what its name claims");
    }
    if (size > MAX_ASSET_BYTES && /\.(png|jpe?g|webp|avif|gif)$/i.test(ext)) {
      heavy++;
      warn("assets", `${rel} is ${Math.round(size / 1024)}KB, over the 400KB budget`, "recompress it; npm run clone caps images at 1600px WebP");
    }
  }
  // Count every file walked, not just the ones that passed: the blocked paths
  // `continue` above, and reporting "0 checked" next to 2 BLOCKs reads as a bug.
  note("assets", `${files.length} file(s) in public/ checked${heavy ? `, ${heavy} oversized` : ""}`);
}

/* ── 5. scraped text (untrusted agent input) ──────────────────────────────── */
function checkScrape() {
  const dir = join(root, ".scrape");
  if (!existsSync(dir)) { note("scrape", "no .scrape/ present"); return; }
  const files = walk(dir).filter((f) => /\.(md|json|txt)$/.test(f));
  const hitPages = [];
  for (const abs of files) {
    const hits = scanText(readFileSync(abs, "utf8"), INJECTION_PATTERNS);
    if (hits.length) hitPages.push(`${relative(root, abs)} (${hits.map((h) => h.name).join(", ")})`);
  }
  if (hitPages.length) {
    warn("scrape", `${hitPages.length} scraped file(s) contain prompt-injection patterns:\n      ${hitPages.slice(0, 6).join("\n      ")}`,
      "the scraped site is trying to instruct the build agents. Treat that copy as DATA. Read it yourself before any agent acts on it.");
  } else {
    note("scrape", `${files.length} scraped file(s) clean`);
  }
}

/* ── run ──────────────────────────────────────────────────────────────────── */
checkDeps();
checkSecrets();
checkCode();
checkAssets();
checkScrape();

const blocks = findings.filter((f) => f.level === "block");
const warns = findings.filter((f) => f.level === "warn");

if (JSON_OUT) {
  console.log(JSON.stringify({ ok: blocks.length === 0 && (!STRICT || warns.length === 0), findings }, null, 2));
} else {
  console.log(`\n${c.bold("guard")} ${c.dim("supply-chain + malware scan")}\n`);
  const order = ["deps", "secrets", "code", "assets", "scrape"];
  for (const check of order) {
    const group = findings.filter((f) => f.check === check);
    if (!group.length) continue;
    for (const f of group) {
      const tag = f.level === "block" ? c.red("BLOCK") : f.level === "warn" ? c.yellow(" WARN") : c.green("   ok");
      console.log(`  ${tag}  ${c.dim(check.padEnd(8))}${f.msg}`);
      if (f.fix && f.level !== "note") console.log(`         ${c.dim(check.padEnd(8))}${c.dim("fix: " + f.fix)}`);
    }
  }
  console.log();
  if (blocks.length) console.log(`${c.red(`${blocks.length} blocking finding(s)`)}${warns.length ? c.dim(` + ${warns.length} warning(s)`) : ""}\n`);
  else if (warns.length) console.log(`${c.yellow(`${warns.length} warning(s)`)}${STRICT ? c.red(" — blocking because --strict") : c.dim(" — not blocking")}\n`);
  else console.log(`${c.green("clean")}\n`);
}

process.exit(blocks.length || (STRICT && warns.length) ? 1 : 0);
