#!/usr/bin/env node
/**
 * go — the one command. Deps, brand, security scan, build, dev server.
 *
 *   npm run go                 deps if stale, brand, guard, build, dev on :3000
 *   npm run go -- --update     force every dependency to latest first
 *   npm run go -- --no-dev     stop after a green build (use in CI)
 *   npm run go -- --fast       skip deps and guard, straight to build + dev
 *
 * Dependency updates are the only slow step (tens of seconds to minutes), so
 * they are stamped: a full update runs at most once a day unless forced. The
 * build itself is ~12s cold and ~8s warm, so it always runs.
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { root } from "./lib/env.mjs";

const argv = process.argv.slice(2);
const has = (n) => argv.includes(`--${n}`);
const FORCE_UPDATE = has("update");
const FAST = has("fast");
const NO_DEV = has("no-dev");
const PORT = (() => {
  const i = argv.indexOf("--port");
  return i >= 0 && argv[i + 1] ? argv[i + 1] : "3000";
})();

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const STAMP = join(root, "node_modules", ".factory-update-stamp");
const t0 = Date.now();
const elapsed = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
const step = (label, detail = "") => console.log(`  ${c.dim(label.padEnd(9))}${detail}`);
const die = (msg, detail = "") => {
  console.error(`\n${c.red("go failed:")} ${msg}\n${detail ? detail + "\n" : ""}`);
  process.exit(1);
};

/** Run a command, capture output, return {ok, out}. Never throws. */
function run(cmd, args, { quiet = true } = {}) {
  try {
    const out = execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: quiet ? "pipe" : "inherit", maxBuffer: 64 * 1024 * 1024 });
    return { ok: true, out: out || "" };
  } catch (e) {
    return { ok: false, out: `${e.stdout || ""}${e.stderr || ""}` || e.message };
  }
}

/** The shortest line that actually says what broke. Full logs are noise. */
function firstError(out) {
  const lines = String(out).split("\n").map((l) => l.trim()).filter(Boolean);
  const hit = lines.find((l) => /^(?:error|Error|Type error|Failed to compile|Module not found|✗)/i.test(l))
    || lines.find((l) => /error/i.test(l) && !/0 errors/i.test(l));
  return hit || lines.slice(-3).join("\n");
}

console.log(`\n${c.bold("go")} ${c.dim("deps -> brand -> guard -> build -> dev")}\n`);

/* ── 1. dependencies ──────────────────────────────────────────────────────── */
if (FAST) {
  step("deps", c.dim("skipped (--fast)"));
} else {
  const needInstall = !existsSync(join(root, "node_modules", "next"));
  const stampAge = existsSync(STAMP) ? (Date.now() - statSync(STAMP).mtimeMs) / 86_400_000 : Infinity;
  const wantUpdate = FORCE_UPDATE || stampAge > 1;

  if (needInstall) {
    step("deps", "installing ...");
    const r = run("npm", ["install"]);
    if (!r.ok) die("npm install failed", firstError(r.out));
  }
  if (wantUpdate) {
    step("deps", FORCE_UPDATE ? "updating to latest ..." : c.dim(`last update ${stampAge === Infinity ? "never" : `${stampAge.toFixed(1)}d ago`}, refreshing ...`));
    const r = run("node", ["scripts/update-deps.mjs"]);
    if (!r.ok) {
      // A failed update must not block the build: the previous tree still works.
      step("deps", c.yellow("update failed, continuing on the current lockfile"));
      console.log(`  ${c.dim("         ")}${c.dim(firstError(r.out).split("\n")[0])}`);
    } else {
      writeFileSync(STAMP, new Date().toISOString());
      step("deps", c.green("latest"));
    }
  } else {
    step("deps", c.green("current") + c.dim(` (updated ${stampAge.toFixed(1)}d ago, --update to force)`));
  }
}

/* ── 2. brand sync ────────────────────────────────────────────────────────── */
{
  const r = run("node", ["scripts/apply-brand.mjs"]);
  if (!r.ok) die("npm run brand failed", firstError(r.out));
  const name = (() => {
    try { return (readFileSync(join(root, "brand.config.ts"), "utf8").match(/name:\s*"([^"]+)"/) || [])[1]; } catch { return null; }
  })();
  step("brand", c.green("synced") + (name ? c.dim(` — ${name}`) : ""));
}

/* ── 3. security scan ─────────────────────────────────────────────────────── */
if (FAST) {
  step("guard", c.dim("skipped (--fast)"));
} else {
  const r = run("node", ["scripts/guard.mjs", "--json"]);
  if (r.ok) step("guard", c.green("clean"));
  else {
    let blocks = [];
    try { blocks = (JSON.parse(r.out).findings || []).filter((f) => f.level === "block"); } catch { /* unparseable */ }
    if (!blocks.length) step("guard", c.yellow("scan inconclusive, run `npm run guard`"));
    else {
      console.error(`\n${c.red("blocked by guard:")}`);
      for (const f of blocks) console.error(`  ${c.red("BLOCK")}  ${c.dim(f.check.padEnd(8))}${f.msg}`);
      console.error(`\n${c.dim("Run `npm run guard` for fixes. --fast skips the scan, but do not ship unscanned.")}\n`);
      process.exit(1);
    }
  }
}

/* ── 4. build ─────────────────────────────────────────────────────────────── */
{
  step("build", "compiling ...");
  const r = run("npm", ["run", "build"]);
  if (!r.ok) {
    console.error(`\n${c.red("build failed")} ${c.dim(`after ${elapsed()}`)}\n`);
    console.error(firstError(r.out));
    console.error(`\n${c.dim("Run `npm run build` for the full output, or `/run` to have the errors fixed.")}\n`);
    process.exit(1);
  }
  const routes = (r.out.match(/^[├└]\s+[○ƒ●]\s+\S+/gm) || []).length;
  step("build", c.green("green") + c.dim(` — ${routes} route(s), ${elapsed()}`));

  // A green build can still ship unstyled, so assert a real stylesheet exists.
  const v = run("node", ["scripts/verify-build.mjs"]);
  step("verify", v.ok ? c.green("stylesheet present on every page") : c.yellow("verify failed — the build emitted no CSS or a page does not link it"));
  if (!v.ok) console.log(`  ${c.dim("         ")}${c.dim(firstError(v.out).split("\n")[0])}`);
}

if (NO_DEV) {
  console.log(`\n${c.green("done")} ${c.dim(elapsed())}\n`);
  process.exit(0);
}

/* ── 5. dev server ────────────────────────────────────────────────────────── */
console.log(`\n  ${c.dim("dev")}      ${c.cyan(`http://localhost:${PORT}`)} ${c.dim(`(ready in ${elapsed()})`)}\n`);
// Webpack, not Turbopack: Turbopack leaks uncapped native memory on M-series
// Macs (vercel/next.js#93896). Inherit stdio so Next owns the terminal.
const dev = spawn("npm", ["run", "dev", "--", "--port", PORT], { cwd: root, stdio: "inherit" });
dev.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => dev.kill(sig));
