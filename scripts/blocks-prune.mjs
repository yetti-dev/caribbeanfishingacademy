#!/usr/bin/env node
/**
 * blocks-prune — keep only blocks that actually compile.
 *
 *   npm run blocks:prune            iterate tsc, delete failing files
 *   npm run blocks:prune -- --dry   report what would go
 *
 * A thousand files from seven third parties will not all typecheck against this
 * project's React and TypeScript versions. React 19 changed useRef's type, and
 * removed the global JSX namespace, so a slice of every registry is broken here
 * through no fault of ours.
 *
 * Rather than hand-patch a moving target, prove each block compiles and delete
 * the ones that do not. Deleting is safe: a block nobody can build is worth
 * nothing, and the manifest records why it went so the decision is auditable.
 *
 * Iterates because removing a file can orphan an import in another file, which
 * surfaces new errors on the next pass.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join, relative } from "node:path";
import { root } from "./lib/env.mjs";

const DRY = process.argv.includes("--dry");
const MAX_PASSES = 8;
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const BLOCKS = join(root, "components", "blocks");
const MANIFEST = join(BLOCKS, "blocks.json");

/** tsc errors grouped by file, restricted to the blocks tree. */
function typeErrors() {
  let out = "";
  try { execFileSync("npx", ["tsc", "--noEmit"], { cwd: root, encoding: "utf8", stdio: "pipe", maxBuffer: 64 * 1024 * 1024 }); }
  catch (e) { out = `${e.stdout || ""}${e.stderr || ""}`; }
  const byFile = new Map();
  for (const line of out.split("\n")) {
    const m = line.match(/^(\S+?\.tsx?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.*)$/);
    if (!m) continue;
    const [, file, , , code, msg] = m;
    if (!file.startsWith("components/blocks/")) continue;
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(`${code}: ${msg.slice(0, 90)}`);
  }
  return { byFile, raw: out };
}

console.log(`\n${c.bold("blocks-prune")} ${c.dim(DRY ? "(dry run)" : "")}\n`);

const removed = [];
let pass = 0;
for (; pass < MAX_PASSES; pass++) {
  const { byFile } = typeErrors();
  // Errors outside components/blocks are OUR bugs and must not be pruned away.
  if (!byFile.size) { console.log(`  ${c.green("clean")}  no type errors in components/blocks after ${pass} pass(es)`); break; }
  console.log(`  ${c.dim(`pass ${pass + 1}`)}  ${byFile.size} file(s) with errors`);
  for (const [file, errs] of byFile) {
    removed.push({ file, reason: errs[0], errorCount: errs.length });
    if (!DRY) { const abs = join(root, file); if (existsSync(abs)) unlinkSync(abs); }
  }
  if (DRY) break;
}
if (pass === MAX_PASSES) console.log(`  ${c.yellow("stopped")} after ${MAX_PASSES} passes`);

/* Drop pruned entries from the manifest so it never advertises a missing file. */
if (!DRY && existsSync(MANIFEST)) {
  const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const gone = new Set(removed.map((r) => r.file));
  const before = m.blocks.length;
  m.blocks = m.blocks.filter((b) => {
    const survives = (b.files || []).filter((f) => !gone.has(f) && existsSync(join(root, f)));
    if (!survives.length) return false;
    b.files = survives;
    return true;
  });
  m.rejected = [...(m.rejected || []), ...removed.map((r) => ({ name: r.file.split("/").pop().replace(/\.tsx?$/, ""), registry: r.file.split("/")[2], reason: `does not compile — ${r.reason}` }))];
  m.prunedAt = new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n");
  console.log(`\n  ${c.dim("manifest")} ${before} -> ${c.cyan(String(m.blocks.length))} block(s)`);
}

const byReg = {};
for (const r of removed) { const k = r.file.split("/")[2]; byReg[k] = (byReg[k] || 0) + 1; }
console.log(`  ${c.dim("removed")}  ${removed.length} file(s)${Object.keys(byReg).length ? ` — ${Object.entries(byReg).map(([k, v]) => `${k}:${v}`).join(" ")}` : ""}`);
const reasons = {};
for (const r of removed) { const k = r.reason.split(":")[0]; reasons[k] = (reasons[k] || 0) + 1; }
console.log(`  ${c.dim("reasons")}  ${Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k}:${v}`).join("  ")}\n`);
