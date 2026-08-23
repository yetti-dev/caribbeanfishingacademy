#!/usr/bin/env node
/**
 * verify-build — prove the LAST build actually emitted a real stylesheet, and that
 * every page HTML references it.
 *
 *   npm run build && npm run verify
 *
 * This exists because "deployed site renders with no CSS" is a silent failure: the
 * build goes green, the HTML ships, and only the stylesheet is missing or purged
 * down to nothing. Catch it locally instead of in production.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
// A Tailwind build with a working source scan is tens of KB. A few KB means the
// preflight/reset landed but every utility class was purged.
const MIN_CSS_BYTES = 8 * 1024;

const fail = (msg, fix) => {
  console.error(`\n${c.red("css verify failed:")} ${msg}\n${c.dim("fix:")} ${fix}\n`);
  process.exit(1);
};

const cssDir = join(root, ".next", "static", "css");
if (!existsSync(join(root, ".next"))) fail("no .next directory", "run npm run build first");
if (!existsSync(cssDir)) {
  fail("the build emitted NO stylesheet at all",
    "check that app/globals.css is imported in app/(site)/layout.tsx and that postcss.config.mjs and @tailwindcss/postcss are installed");
}

const files = readdirSync(cssDir).filter((f) => f.endsWith(".css"));
if (!files.length) fail("no .css file in .next/static/css", "same as above: the PostCSS/Tailwind step did not run");

let total = 0;
let biggest = { file: null, bytes: 0, utilities: 0 };
for (const f of files) {
  const bytes = statSync(join(cssDir, f)).size;
  total += bytes;
  const src = readFileSync(join(cssDir, f), "utf8");
  // count a few utilities that every build of this starter must contain
  const utilities = [".flex", ".grid", "--tw-", "text-", "bg-"].filter((t) => src.includes(t)).length;
  if (bytes > biggest.bytes) biggest = { file: f, bytes, utilities };
  console.log(`  ${c.dim("css")}  ${f}  ${(bytes / 1024).toFixed(1)}KB`);
}

if (total < MIN_CSS_BYTES) {
  fail(`stylesheet is only ${(total / 1024).toFixed(1)}KB, utilities were purged`,
    "check the @source globs at the top of app/globals.css cover every directory holding class names, and that no source dir is gitignored");
}
if (biggest.utilities < 3) {
  fail("the stylesheet contains no Tailwind utilities, only the reset",
    "the source scan matched nothing: verify the @source globs in app/globals.css");
}

// Every prerendered page must actually link a stylesheet.
const serverApp = join(root, ".next", "server", "app");
if (existsSync(serverApp)) {
  const htmls = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) htmls.push(p);
    }
  };
  walk(serverApp);
  // Framework-internal fallbacks (_global-error, _not-found) ship without CSS by design.
  const naked = htmls.filter((p) => !/\/_[^/]+\.html$/.test(p) && !/not-found\.html$/.test(p))
    .filter((p) => !readFileSync(p, "utf8").includes("/_next/static/css/"));
  if (naked.length) {
    fail(`${naked.length} prerendered page(s) link no stylesheet (${naked[0].replace(root + "/", "")})`,
      "that route's layout does not import globals.css");
  }
  console.log(`  ${c.dim("html")} ${htmls.length} prerendered page(s), all link a stylesheet`);
}

console.log(`\n${c.green("css ok")}  ${(total / 1024).toFixed(1)}KB across ${files.length} file(s)\n`);
