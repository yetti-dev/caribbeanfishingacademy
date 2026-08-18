#!/usr/bin/env node
/**
 * update-deps — bring Next.js and every other dependency to latest.
 *
 *   npm run up            # bump everything to latest, install
 *   npm run up -- --dry   # show what would change, touch nothing
 *   npm run up -- --minor # skip major-version jumps (safe mode)
 *
 * Prints a before/after table and flags major bumps, which are the ones that can
 * break the build. `/update` runs this, then `npm run build`, then fixes fallout.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const DRY = argv.includes("--dry");
const MINOR_ONLY = argv.includes("--minor");

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const major = (v) => Number(String(v).replace(/^\D*/, "").split(".")[0]);

// `npm view a b c version --json` only reports the FIRST package, so hit the registry
// directly instead, all names in parallel.
async function latestVersions(names) {
  const map = {};
  await Promise.all(names.map(async (name) => {
    try {
      // Plain Accept only: the abbreviated packument type 406s on /latest.
      const res = await fetch(`https://registry.npmjs.org/${name.replace("/", "%2f")}/latest`, {
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) map[name] = (await res.json()).version;
    } catch { /* offline or unpublished, leave it out and keep the current pin */ }
  }));
  const missed = names.filter((n) => !map[n]);
  for (const name of missed) {
    try { map[name] = execFileSync("npm", ["view", name, "version"], { encoding: "utf8", cwd: root }).trim(); }
    catch { /* give up on this one */ }
  }
  return map;
}

console.log(`\n${c.bold("update deps")} ${c.dim(DRY ? "(dry run)" : MINOR_ONLY ? "(minor only)" : "")}\n`);

const buckets = ["dependencies", "devDependencies"];
const names = buckets.flatMap((b) => Object.keys(pkg[b] || {}));
const latest = await latestVersions(names);
const unresolved = names.filter((n) => !latest[n]);
if (unresolved.length) console.log(`  ${c.yellow("?")} no version found for: ${unresolved.join(", ")}\n`);

const changes = [];
for (const bucket of buckets) {
  for (const [name, current] of Object.entries(pkg[bucket] || {})) {
    const next = latest[name];
    if (!next) continue;
    const isMajor = major(next) > major(current);
    if (MINOR_ONLY && isMajor) {
      console.log(`  ${c.yellow("skip")}  ${name} ${c.dim(`${current} -> ${next} (major)`)}`);
      continue;
    }
    // Next and its eslint config are version-locked to each other: pin both exactly.
    const exact = name === "next" || name === "eslint-config-next" || name === "react" || name === "react-dom";
    const spec = exact ? next : `^${next}`;
    if (current === spec) continue;
    pkg[bucket][name] = spec;
    changes.push({ name, from: current, to: spec, isMajor });
  }
}

if (!changes.length) {
  console.log(`  ${c.green("already latest")}\n`);
  process.exit(0);
}
const pad = Math.max(...changes.map((x) => x.name.length));
for (const x of changes) {
  console.log(`  ${x.name.padEnd(pad)}  ${c.dim(x.from)} -> ${x.isMajor ? c.yellow(x.to) : c.cyan(x.to)}${x.isMajor ? c.dim("  major") : ""}`);
}

if (DRY) {
  console.log(`\n  ${c.dim("dry run, package.json untouched")}\n`);
  process.exit(0);
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`\n  ${c.dim("installing ...")}\n`);
execFileSync("npm", ["install"], { cwd: root, stdio: "inherit" });

const majors = changes.filter((x) => x.isMajor);
console.log(`\n${c.green("updated")} ${changes.length} package(s)${majors.length ? `, ${c.yellow(`${majors.length} major`)}` : ""}`);
if (majors.length) {
  console.log(`${c.dim("majors:")} ${majors.map((m) => m.name).join(", ")}  ${c.dim("read their release notes if the build breaks")}`);
}
console.log(`${c.dim("next:")}  npm run build\n`);
