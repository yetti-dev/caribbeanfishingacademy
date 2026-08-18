#!/usr/bin/env node
/**
 * check — sub-second preflight. Files only, no network, no build.
 *
 *   npm run check
 *
 * Exit 1 if anything is a blocker (x), 0 otherwise (warnings are fine to build on).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
let blockers = 0;
let warnings = 0;
const ok = (label, note = "") => console.log(`  ${c.green("v")} ${label} ${c.dim(note)}`);
const warn = (label, note = "") => { warnings++; console.log(`  ${c.yellow("!")} ${label} ${c.dim(note)}`); };
const bad = (label, note = "") => { blockers++; console.log(`  ${c.red("x")} ${label} ${c.dim(note)}`); };
const read = (p) => { try { return readFileSync(join(root, p), "utf8"); } catch { return ""; } };
const sh = (cmd, args) => { try { return execFileSync(cmd, args, { cwd: root, encoding: "utf8" }).trim(); } catch { return null; } };

console.log(`\n${c.bold("preflight")}\n`);

// ── toolchain ────────────────────────────────────────────────────────────────
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= 20) ok("node", process.version);
else bad("node", `${process.version}, need >=20.9`);
if (existsSync(join(root, "node_modules"))) ok("node_modules", "installed");
else bad("node_modules", "run npm install");

// ── brand ────────────────────────────────────────────────────────────────────
const cfg = read("brand.config.ts");
const val = (key) => cfg.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1] ?? "";
const name = val("name");
const hue = cfg.match(/hue:\s*(\d+)/)?.[1];
if (!name || name === "New Site") warn("brand name", "still the placeholder, /build sets it");
else ok("brand name", name);
if (val("tagline")) ok("tagline", val("tagline").slice(0, 50));
else warn("tagline", "empty");

const css = read("app/globals.css");
const cssHue = css.match(/--brand-hue:\s*(\d+)/)?.[1];
if (hue && cssHue && hue !== cssHue) warn("theme sync", `config hue ${hue} vs css ${cssHue}, run npm run brand`);
else if (hue) ok("theme hue", hue);
const fontsFile = read("lib/fonts.ts");
const display = val("display");
if (display && fontsFile && !fontsFile.includes(display.replace(/ /g, "_"))) {
  warn("font sync", `config wants ${display}, run npm run brand`);
} else if (display) ok("display font", display);

// Build-time CSS/TS deps must never sit in devDependencies: a Vercel project with
// NODE_ENV=production skips those, and the deploy then renders unstyled.
const pkg = JSON.parse(read("package.json") || "{}");
const misplaced = ["tailwindcss", "@tailwindcss/postcss", "typescript"].filter((d) => pkg.devDependencies?.[d]);
if (misplaced.length) bad("css deps", `${misplaced.join(" ")} in devDependencies, move to dependencies`);
else ok("css deps", "tailwind + typescript in dependencies");
const cssSources = read("app/globals.css").match(/@source\s/g)?.length ?? 0;
if (cssSources) ok("@source globs", `${cssSources} declared in globals.css`);
else warn("@source globs", "none, utilities rely on auto-detection and can purge in production");

// ── content ──────────────────────────────────────────────────────────────────
const knowledge = read("content/knowledge.md");
if (knowledge.length > 200) ok("knowledge.md", `${knowledge.length} chars, feeds the FAQ widget`);
else warn("knowledge.md", "thin, the FAQ widget has little to answer from");
const contentFiles = existsSync(join(root, "content")) ? readdirSync(join(root, "content")).filter((f) => f.endsWith(".ts")) : [];
if (contentFiles.length > 1) ok("content files", contentFiles.join(" "));
else warn("content files", "only types.ts, copy is not split per page yet");

// ── images ───────────────────────────────────────────────────────────────────
const ingest = join(root, "public", "ingested");
let imgCount = 0;
const heavy = [];
if (existsSync(ingest)) {
  for (const dir of readdirSync(ingest)) {
    const d = join(ingest, dir);
    if (!statSync(d).isDirectory()) continue;
    for (const f of readdirSync(d)) {
      imgCount++;
      const size = statSync(join(d, f)).size;
      if (size > 400 * 1024) heavy.push(`${dir}/${f}`);
    }
  }
}
if (!imgCount) warn("images", "none scraped yet, /build downloads them");
else if (heavy.length) warn("images", `${imgCount} found, ${heavy.length} over 400KB (${heavy[0]})`);
else ok("images", `${imgCount} compressed`);

// ── env ──────────────────────────────────────────────────────────────────────
const env = read(".env");
if (!env) warn(".env", "missing, copy .env.example");
else if (/OPENAI_API_KEY=\S+/.test(env)) ok("OPENAI_API_KEY", "set, FAQ widget will answer");
else warn("OPENAI_API_KEY", "not set, FAQ widget cannot answer");

// ── git ──────────────────────────────────────────────────────────────────────
if (!existsSync(join(root, ".git"))) warn("git", "not a repo, run git init before ship");
else {
  const branch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]) || "?";
  const dirty = (sh("git", ["status", "--porcelain"]) || "").split("\n").filter(Boolean).length;
  ok("git", `${branch}, ${dirty ? `${dirty} uncommitted` : "clean"}`);
  const remote = sh("git", ["remote", "get-url", "origin"]);
  if (remote) ok("origin", remote);
  else warn("origin", "none, pass the repo URL to npm run ship");
}

// ── factory ──────────────────────────────────────────────────────────────────
const skills = ["update", "build", "run", "ship", "check"].filter((s) => existsSync(join(root, ".claude/skills", s, "SKILL.md")));
if (skills.length === 5) ok("skills", skills.join(" "));
else bad("skills", `missing: ${["update", "build", "run", "ship", "check"].filter((s) => !skills.includes(s)).join(" ")}`);
if (existsSync(join(root, "CLAUDE.md"))) ok("CLAUDE.md", "design law loaded");
else bad("CLAUDE.md", "missing");
if (existsSync(join(root, ".claude/skills/ui-ux-pro-max/scripts/search.py"))) ok("ui-ux-pro-max", "design DB available");
else warn("ui-ux-pro-max", "design DB missing");

// ── verdict ──────────────────────────────────────────────────────────────────
console.log();
if (blockers) console.log(`${c.red(`${blockers} blocker(s)`)}${warnings ? c.dim(`, ${warnings} warning(s)`) : ""}\n`);
else console.log(`${c.green("ready")}${warnings ? c.dim(` (${warnings} warning(s))`) : ""}\n`);
process.exit(blockers ? 1 : 0);
