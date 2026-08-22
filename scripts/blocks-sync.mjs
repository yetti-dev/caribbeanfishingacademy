#!/usr/bin/env node
/**
 * blocks-sync — pull a large, curated block library from public shadcn registries.
 *
 *   npm run blocks                    fetch, scan, write, manifest
 *   npm run blocks -- --limit 300     cap the total
 *   npm run blocks -- --dry           report only
 *   npm run blocks -- --only aceternity,magicui
 *
 * Why direct-write instead of `npx shadcn add`: every registry below inlines file
 * content in its item JSON, so 1000 CLI invocations (each re-resolving the whole
 * project) buys nothing. Writing the files ourselves also lets us pin the target
 * directory per registry, rewrite imports to this project's aliases, and refuse
 * a file before it ever lands on disk.
 *
 * SECURITY: every file is scanned with the same rules as `npm run guard` BEFORE
 * being written. This is a thousand files of code from seven third parties, so a
 * quarantine step is the whole point. Rejected items are listed in the manifest
 * with their reason and never reach components/.
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { root } from "./lib/env.mjs";
import { scanText, CODE_PATTERNS } from "./lib/security.mjs";

const argv = process.argv.slice(2);
const flag = (n, d = null) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`);
const DRY = has("dry");
const LIMIT = Number(flag("limit", 1200));
const ONLY = flag("only") ? flag("only").split(",").map((s) => s.trim()) : null;
const CONCURRENCY = 12;

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/*
 * Dependencies we are willing to add. Everything else disqualifies an item:
 * a 3D scene or a syntax highlighter is not worth carrying in a site factory,
 * and each extra package is extra supply-chain surface.
 */
const ALLOWED_DEPS = new Set([
  "motion", "framer-motion", "lucide-react", "clsx", "tailwind-merge",
  "class-variance-authority", "tw-animate-css", "react", "react-dom", "next",
  "@radix-ui/react-slot", "radix-ui",
]);
const stripRange = (d) => String(d).replace(/@[\^~>=<\d].*$/, "").trim();

const REGISTRIES = [
  {
    key: "aceternity", label: "Aceternity UI",
    index: "https://ui.aceternity.com/registry.json",
    item: (n) => `https://ui.aceternity.com/registry/${n}.json`,
  },
  {
    key: "magicui", label: "Magic UI",
    index: "https://magicui.design/r/registry.json",
    item: (n) => `https://magicui.design/r/${n}.json`,
  },
  {
    key: "reactbits", label: "React Bits",
    index: "https://reactbits.dev/r/registry.json",
    item: (n) => `https://reactbits.dev/r/${n}.json`,
    // 664 entries are 166 components x 4 language/style variants. Keep TypeScript + Tailwind.
    keep: (i) => /-TS-TW$/.test(i.name),
    rename: (n) => n.replace(/-TS-TW$/, ""),
  },
  {
    key: "animateui", label: "Animate UI",
    index: "https://animate-ui.com/r/registry.json",
    item: (n) => `https://animate-ui.com/r/${n}.json`,
    // 260 icons and 159 demos are noise for a site factory.
    keep: (i) => /^(components|primitives)-/.test(i.name),
    rename: (n) => n.replace(/^(components|primitives)-/, ""),
  },
  {
    key: "eldora", label: "Eldora UI",
    index: "https://eldoraui.site/registry.json",
    item: (n) => `https://eldoraui.site/r/${n}.json`,
  },
  {
    key: "basecn", label: "basecn",
    index: "https://basecn.dev/r/registry.json",
    item: (n) => `https://basecn.dev/r/${n}.json`,
  },
].filter((r) => !ONLY || ONLY.includes(r.key));

/** Category from the item name, so the showcase can group ~1000 things usefully. */
const CATEGORY_RULES = [
  [/hero/i, "hero"],
  [/nav|header|menu|sidebar|breadcrumb|tab(s)?$/i, "navigation"],
  [/footer/i, "footer"],
  [/pricing|price|plan/i, "pricing"],
  [/testimonial|review|quote/i, "testimonials"],
  [/feature|bento|grid-?(item|layout)/i, "features"],
  [/cta|call-to-action|newsletter|subscribe|waitlist/i, "cta"],
  [/faq|accordion/i, "faq"],
  [/team|people|avatar|person/i, "team"],
  [/stat|counter|number|metric/i, "stats"],
  [/logo|marquee|slider|carousel|ticker/i, "marquee"],
  [/gallery|image|photo|lens|zoom|parallax/i, "media"],
  [/form|input|contact|select|checkbox|radio|switch|textarea|otp|field/i, "forms"],
  [/button|badge|chip|toggle/i, "buttons"],
  [/card/i, "cards"],
  [/text|type|word|letter|title|heading|reveal|shimmer|gradient/i, "typography"],
  [/background|beam|aurora|particle|dots|mesh|noise|spotlight|glow|wave|grid/i, "backgrounds"],
  [/modal|dialog|drawer|sheet|popover|tooltip|toast|alert/i, "overlays"],
  [/table|chart|progress|skeleton|loader|spinner/i, "data"],
  [/cursor|pointer|magnet|click|hover/i, "interaction"],
  [/scroll|sticky|timeline|step/i, "scroll"],
];
const categorise = (name) => (CATEGORY_RULES.find(([re]) => re.test(name)) || [, "misc"])[1];

/* ── import rewriting ─────────────────────────────────────────────────────── */

/**
 * Registry files import from their own layout. Map every known shape onto this
 * project's aliases so the file compiles where we put it.
 */
function rewriteImports(code, registryKey) {
  let out = code;
  const maps = [
    [/(["'])@\/registry\/(?:default\/|new-york\/)?magicui\/([^"']+)\1/g, `$1@/components/blocks/${registryKey}/$2$1`],
    [/(["'])@\/registry\/(?:default\/|new-york\/)?ui\/([^"']+)\1/g, `$1@/components/ui/$2$1`],
    [/(["'])@\/registry\/[^"']*?\/([^\/"']+)\1/g, `$1@/components/blocks/${registryKey}/$2$1`],
    [/(["'])@\/components\/eldoraui\/([^"']+)\1/g, `$1@/components/blocks/${registryKey}/$2$1`],
    [/(["'])@\/components\/animate-ui\/(?:components|primitives|base)\/([^"']+)\1/g, `$1@/components/blocks/${registryKey}/$2$1`],
    [/(["'])@\/components\/magicui\/([^"']+)\1/g, `$1@/components/blocks/${registryKey}/$2$1`],
    [/(["'])@\/lib\/utils(\.[jt]sx?)?\1/g, `$1@/lib/utils$1`],
    // Aceternity ships some files importing its own cn from @/utils/cn.
    [/(["'])@\/utils\/cn\1/g, `$1@/lib/utils$1`],
    [/(["'])@\/lib\/cn\1/g, `$1@/lib/utils$1`],
    // Some registries ship "framer-motion"; this project standardises on "motion".
    [/(["'])framer-motion\1/g, `$1motion/react$1`],
    [/(["'])motion\/react\/client\1/g, `$1motion/react$1`],
  ];
  for (const [re, to] of maps) out = out.replace(re, to);
  // React 19 removed the global JSX namespace; it lives on React now.
  out = out.replace(/(?<!React\.)\bJSX\.Element\b/g, "React.JSX.Element");
  out = out.replace(/(?<!React\.)\bJSX\.IntrinsicElements\b/g, "React.JSX.IntrinsicElements");
  return out;
}

/**
 * Packages a file actually imports, regardless of what the registry declared.
 * Several items import three.js or @react-three/fiber without listing them,
 * so the index-level dependency filter is not enough on its own.
 */
export function importedPackages(code) {
  const out = new Set();
  const re = /(?:from|import)\s*\(?\s*["']([^"'.][^"']*)["']/g;
  let m;
  while ((m = re.exec(code))) {
    const spec = m[1];
    if (spec.startsWith("@/") || spec.startsWith(".")) continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    out.add(pkg);
  }
  return [...out];
}

/** Flatten a registry path into a single file under our blocks dir. */
function targetFor(registryKey, itemName, filePath) {
  const ext = extname(filePath) || ".tsx";
  const base = basename(filePath, ext);
  // Keep the item name when the file is the item's entry point ("index.tsx").
  const stem = /^index$/i.test(base) ? itemName : base;
  return join("components", "blocks", registryKey, `${stem}${ext}`);
}

/* ── fetch helpers ────────────────────────────────────────────────────────── */

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { Accept: "application/json" } });
      if (r.status === 429) { await new Promise((s) => setTimeout(s, 1500 * (i + 1))); continue; }
      if (!r.ok) return { err: `HTTP ${r.status}` };
      return { json: await r.json() };
    } catch (e) { if (i === tries - 1) return { err: e.message.slice(0, 60) }; }
  }
  return { err: "retries exhausted" };
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

/* ── run ──────────────────────────────────────────────────────────────────── */

console.log(`\n${c.bold("blocks-sync")} ${c.dim(`${REGISTRIES.length} registry(ies), cap ${LIMIT}${DRY ? ", dry run" : ""}`)}\n`);

const manifest = { generatedAt: new Date().toISOString(), registries: {}, blocks: [], rejected: [] };
let written = 0, skippedDeps = 0, quarantined = 0, failed = 0;

for (const reg of REGISTRIES) {
  const { json, err } = await getJson(reg.index);
  if (err) { console.log(`  ${c.red("fail")}  ${reg.key.padEnd(11)} index ${err}`); continue; }
  let items = Array.isArray(json) ? json : json.items || [];
  items = items.filter((i) => i?.name && i.name !== "index" && i.type !== "registry:style");
  const total = items.length;
  if (reg.keep) items = items.filter(reg.keep);
  const afterVariants = items.length;

  // Dependency budget, decided from the index so we never even fetch the rest.
  items = items.filter((i) => (i.dependencies || []).every((d) => ALLOWED_DEPS.has(stripRange(d))));
  const eligible = items.length;
  skippedDeps += afterVariants - eligible;

  const room = Math.max(0, LIMIT - written);
  if (!room) { console.log(`  ${c.dim("skip")}  ${reg.key.padEnd(11)} cap reached`); break; }
  const take = items.slice(0, room);

  const results = await pool(take, CONCURRENCY, async (item) => {
    const { json: it, err: e } = await getJson(reg.item(item.name));
    if (e) return { name: item.name, err: e };
    const files = (it.files || []).filter((f) => f.content && /\.(tsx?|jsx?)$/.test(f.path || ""));
    if (!files.length) return { name: item.name, err: "no usable files" };

    const display = reg.rename ? reg.rename(item.name) : item.name;
    const out = [];
    for (const f of files) {
      const code = rewriteImports(f.content, reg.key);
      /*
       * Trust the code, not the manifest. Items exist that import three.js or
       * @react-three/fiber without declaring them, which type-errors the whole
       * project. Reject on what is actually imported.
       */
      const undeclared = importedPackages(code).filter((pkg) => !ALLOWED_DEPS.has(pkg));
      if (undeclared.length) return { name: display, rejected: `imports ${undeclared.join(", ")}` };
      // Quarantine BEFORE writing. Same rules guard uses.
      const hits = scanText(code, CODE_PATTERNS).filter((h) => h.sev === "high");
      if (hits.length) {
        return { name: display, quarantined: hits.map((h) => `${h.name} (line ${h.line})`), file: f.path };
      }
      out.push({ target: targetFor(reg.key, display, f.path), code });
    }
    if (!DRY) {
      for (const o of out) {
        await mkdir(dirname(join(root, o.target)), { recursive: true });
        await writeFile(join(root, o.target), o.code);
      }
    }
    return {
      name: display, registry: reg.key, title: it.title || item.title || display,
      description: it.description || item.description || null,
      category: categorise(display), type: it.type || item.type,
      files: out.map((o) => o.target),
      registryDependencies: it.registryDependencies || [],
    };
  });

  for (const r of results) {
    if (!r) { failed++; continue; }
    if (r.err) { failed++; manifest.rejected.push({ name: r.name, registry: reg.key, reason: r.err }); continue; }
    if (r.rejected) {
      skippedDeps++;
      manifest.rejected.push({ name: r.name, registry: reg.key, reason: r.rejected });
      continue;
    }
    if (r.quarantined) {
      quarantined++;
      manifest.rejected.push({ name: r.name, registry: reg.key, reason: `quarantined: ${r.quarantined.join(", ")}` });
      continue;
    }
    manifest.blocks.push(r);
    written++;
  }
  manifest.registries[reg.key] = { label: reg.label, indexItems: total, eligible, taken: take.length };
  console.log(`  ${c.green("ok")}    ${reg.key.padEnd(11)} ${String(total).padStart(4)} indexed  ${String(eligible).padStart(4)} eligible  ${String(results.filter((r) => r && !r.err && !r.quarantined).length).padStart(4)} written`);
}

if (!DRY) {
  await writeFile(join(root, "components", "blocks", "blocks.json"), JSON.stringify(manifest, null, 2) + "\n");
}

const byCat = {};
for (const b of manifest.blocks) byCat[b.category] = (byCat[b.category] || 0) + 1;

console.log(`\n  ${c.bold("total")}     ${c.cyan(String(written))} block(s) across ${Object.keys(manifest.registries).length} registry(ies)`);
console.log(`  ${c.dim("skipped")}   ${skippedDeps} over the dependency budget`);
if (quarantined) console.log(`  ${c.yellow("quarantined")} ${quarantined} failed the security scan and were NOT written`);
if (failed) console.log(`  ${c.dim("failed")}    ${failed} could not be fetched`);
console.log(`\n  ${c.dim("categories")} ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join("  ")}`);
console.log(`\n  ${c.dim("manifest")}  components/blocks/blocks.json\n`);
