#!/usr/bin/env node
/**
 * blocks-curate — cut the library down to what a real client site can use.
 *
 *   npm run blocks:curate            apply, delete the rest
 *   npm run blocks:curate -- --dry   report only
 *
 * The registries are built for developer portfolios and SaaS launch pages, so
 * they ship a lot of things a boat tour operator will never need: iPhone and
 * MacBook mockups, terminal windows, ASCII art, shader canvases, and heavy
 * particle backgrounds that tank scroll performance on a phone. They also ship
 * up to eight numbered demos of the same component.
 *
 * Rules below are explicit and ordered: DENY wins, then demo de-duplication.
 * Re-run `npm run blocks` to restore anything cut by mistake.
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { root } from "./lib/env.mjs";

const DRY = process.argv.includes("--dry");
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`, cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`, bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

/*
 * DENY — reasons, not just patterns, so the next person knows why.
 */
const DENY = [
  // Device and app-chrome mockups. A tour operator shows boats, not an iPhone.
  [/^(android|iphone|ipad|macbook|safari|notch|dock|kbd)(-|$)/i, "device or app-chrome mockup"],
  [/^safari-browser/i, "device or app-chrome mockup"],

  // Developer-audience widgets: terminals, code windows, hacker aesthetics.
  [/terminal|hacker|ascii-art|glyph-matrix|decrypted|encrypted-text|letter-glitch|glitch-text/i, "developer or code-themed"],

  // GPU-heavy canvases and shaders. These are the ones that make a site feel slow.
  [/shader|pixelated-canvas|webcam|metallic-paint|glass-surface|drift-wall|cloud-shader|dither/i, "GPU-heavy canvas"],
  [/particle|fireworks|gravity-stars|glowing-stars|shooting-stars|meteors|lightning|light-rays|^lamp$/i, "heavy animated background"],
  [/warp-background|background-ripple|interactive-grid|flickering-grid|layout-grid|hexagon-pattern|striped-pattern/i, "busy animated background"],
  [/^(splash-?cursor|smooth-cursor|blob-?cursor|crosshair|cursor-grid|text-cursor)/i, "custom cursor, fights usability"],

  /*
   * Grid and dot patterns. CLAUDE.md bans them in a hero as the biggest
   * "AI made this" tell, and the same is true of the registry versions, so they
   * are not worth keeping at all. Same for aurora: it is on the banned list and
   * the local component was already deleted for the same reason.
   */
  [/grid-pattern|retro-grid|^grid$|^shape-grid$|dot-pattern|dotted-glow|^aurora-background$/i, "grid or dot pattern, banned by the design law"],
  [/^background-beams|^backgrounds-(bubble|hexagon|hole|stars)$/i, "decorative background, adds nothing on a client site"],

  // Novelty type effects. Keep the tasteful ones, drop the toys.
  [/comic-text|squiggly|fuzzy-text|text-3d-flip|spinning-text|wavy-text|kinetic-text|depth-text|echo-text|text-flipping-board|canvas-text|text-pressure|circular-text|true-focus|variable-proximity/i, "novelty type effect"],

  // Product-specific or framework plumbing that means nothing on a client site.
  [/^clerk-|^community-|^integrations|^google-gemini|^effects-theme-toggler|^animate-slot|^utils$|^empty$|^aspect-ratio$|^label$|^table$|^skeleton$|^spinner$|^loader$/i, "internal or product-specific"],
  [/^(folder|stack|glass-icons|option-wheel|pixel-swap|scales|moving-line|electric-border|star-border)$/i, "novelty widget"],
  [/svg-mask-effect|svg-ripple|^ripple(-demo)?$|^cool-mode/i, "novelty effect"],
  [/^(pixel-card|holographic-card|evervault-card|neon-gradient-card|draggable-card|reflective-card|pixel-image)/i, "novelty card"],
  [/^(rainbow-button|pulsating-button|live-button|stateful-button)/i, "novelty button"],
  [/animated-beam/i, "diagram connector, not a marketing block"],
  [/^(icon-cloud|orbiting-circles|animated-list|dot-field|gooey-input|curved-input|curved-loop|gradual-blur|progressive-blur|backlight)/i, "not useful for a tour site"],
];

/*
 * KEEP — an explicit rescue list. Anything here survives even if a DENY
 * pattern would have caught it, because it is genuinely useful for this
 * audience (galleries, sliders, maps, scroll-velocity imagery).
 */
const KEEP = [
  /^scroll-based-velocity/i, /^scroll-velocity$/i, /^scroll-expand$/i,
  /^parallax-scroll/i, /^parallax-hero-images$/i, /^hero-parallax$/i, /^hero-video-dialog/i,
  /^images-slider$/i, /^orbit-images$/i, /^chromatic-image$/i, /^lens$/i,
  /^logo-loop$/i, /^logo-cloud-\d+$/i, /^marquee(-3d|-logos)?$/i, /^3d-marquee$/i,
  /^focus-cards$/i, /^card-hover-effect$/i, /^glare-card$/i, /^3d-card$/i, /^wobble-card$/i,
  /^card-flip-hover$/i, /^spotlight-card$/i, /^tilted-card$/i, /^profile-card$/i, /^comet-card$/i,
  /^infinite-moving-cards$/i, /^card-stack$/i, /^direction-aware-hover$/i, /^card$/i,
  /^features-section-demo-1$/i, /^cta-03$/i, /^testimonal-03$/i, /^timeline$/i, /^stepper$/i,
  /^map(-demo)?$/i, /^avatar-circles/i, /^number-ticker$/i, /^counter$/i, /^count-up$/i,
  /^floating-navbar$/i, /^navbar-menu$/i, /^gooey-nav$/i, /^line-sidebar$/i,
  /^input$/i, /^textarea$/i, /^placeholders-and-vanish-input$/i, /^alert$/i, /^animated-tooltip$/i,
  /^sticky-banner$/i, /^container-scroll-animation$/i, /^sticky-scroll-reveal$/i, /^tracing-beam$/i,
  /^(blur-fade|blur-in-text|fade-text|word-rotate|flip-words|typewriter-effect|text-generate-effect)$/i,
  /^(hyper-text|aurora-text|sparkles-text|line-shadow-text|morphing-text|text-animate)$/i,
  /^(gradient-text|shiny-text|blur-text|rotating-text|animated-shiny-text|text-reveal|text-hover-effect)$/i,
  /^(word-pull-up-text|letter-pull-up-text|gradual-spacing-text|layout-text-flip|container-text-flip)$/i,
  /^(hover-border-gradient|shine-border|background-gradient|colourful-text|video-text)$/i,
  /^(interactive-hover-button|shimmer-button|shiny-button|animated-shiny-button|magnetic-button|ripple-button|animated-badge)$/i,
  /^(magnet|magnet-lines|glare-hover|click-spark|pointer-highlight|following-pointer)$/i,
  // Subtle surface treatments only. No grids, no dots, no aurora.
  /^(noise|noise-background|spotlight|spotlight-new|background-lines|waves|border-glow|glowing-effect)$/i,
  /^(scroll-progress|animated-circular-progress-bar|images-badge|effects-image-zoom|elastic-slider)$/i,
  /^(typing-animation|3d-pin|text-reveal-card|tooltip-card)$/i,
];

const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
/** "typing-animation-demo-5" -> "typing-animation"; "grid-demo-2" -> "grid" */
const baseName = (s) => kebab(s).replace(/-demo(-\d+)?$/,"").replace(/-\d+$/, (m, o, str) => (/^(logo-cloud|cta|testimonal|features-section)/.test(str) ? m : ""));

const MANIFEST = join(root, "components", "blocks", "blocks.json");
const m = JSON.parse(readFileSync(MANIFEST, "utf8"));

const decided = [];
for (const b of m.blocks) {
  const k = kebab(b.name);
  const rescued = KEEP.some((re) => re.test(k));
  const denied = DENY.find(([re]) => re.test(k));
  decided.push({ b, keep: rescued || !denied, reason: rescued ? null : denied?.[1] ?? null, key: k });
}

/*
 * Demo de-duplication. Eight numbered demos of one component is noise; keep the
 * plain component when it exists, otherwise the lowest-numbered demo.
 */
const seen = new Map();
for (const d of decided.filter((x) => x.keep)) {
  const base = baseName(d.key);
  const isDemo = /-demo(-\d+)?$/.test(d.key);
  const rank = isDemo ? 1 + (Number((d.key.match(/-demo-(\d+)$/) || [])[1] || 1)) : 0;
  const prev = seen.get(base);
  if (!prev) { seen.set(base, { ...d, rank }); continue; }
  if (rank < prev.rank) { prev.keep = false; prev.reason = "duplicate demo variant"; seen.set(base, { ...d, rank }); }
  else { d.keep = false; d.reason = "duplicate demo variant"; }
}
for (const d of decided) {
  const chosen = seen.get(baseName(d.key));
  if (d.keep && chosen && chosen.b.name !== d.b.name) { d.keep = false; d.reason = d.reason || "duplicate demo variant"; }
}

const kept = decided.filter((d) => d.keep);
const cut = decided.filter((d) => !d.keep);

console.log(`\n${c.bold("blocks-curate")} ${c.dim(DRY ? "(dry run)" : "")}\n`);
const byReason = {};
for (const d of cut) byReason[d.reason || "unmatched"] = (byReason[d.reason || "unmatched"] || 0) + 1;
for (const [r, n] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c.dim(String(n).padStart(4))}  ${r}`);
}

if (!DRY) {
  for (const d of cut) {
    for (const f of d.b.files || []) {
      const abs = join(root, f);
      if (existsSync(abs)) unlinkSync(abs);
    }
  }
  m.blocks = kept.map((d) => d.b);
  m.rejected = [...(m.rejected || []), ...cut.map((d) => ({ name: d.b.name, registry: d.b.registry, reason: `curated out: ${d.reason || "not useful for client sites"}` }))];
  m.curatedAt = new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n");
}

const byCat = {};
for (const d of kept) byCat[d.b.category] = (byCat[d.b.category] || 0) + 1;
console.log(`\n  ${c.bold("kept")}      ${c.cyan(String(kept.length))}  ${c.dim(`(cut ${cut.length})`)}`);
console.log(`  ${c.dim("categories")} ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join("  ")}\n`);
