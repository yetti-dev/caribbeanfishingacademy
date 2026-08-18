#!/usr/bin/env node
/**
 * clone — the scraper behind `/build`. Pulls a reference site's brand, copy, and
 * media so we can rebuild a better site around it.
 *
 *   node scripts/clone.mjs https://acme.com --slug acme
 *
 * Fast by design: the crawl is a parallel BFS (8 pages at a time), stylesheets and
 * images download in pools, every fetch has a timeout, and images are deduped by
 * normalized URL before a single byte is pulled.
 *
 * Writes .scrape/<slug>/
 *   brand.json     machine-readable build plan (name, hue, logo, nav, inner pages, contact)
 *   plan.md        the short human/agent brief
 *   pages/NN-*.md  ONE file per crawled page (a page-smith agent reads only its own)
 *   faq.md         scraped Q&A, seeds the FAQ widget
 *   media.json     downloaded images + videos + YouTube links
 *   assets/logo.*  the real navbar logo (NOT the favicon)
 * and compressed images to public/ingested/<slug>/.
 *
 * Patches brand.config.ts + content/knowledge.md unless --no-apply.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import * as cheerio from "cheerio";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
if (!url) {
  console.error("Usage: node scripts/clone.mjs <url> [--slug name] [--pages 12] [--images 60] [--no-apply]");
  process.exit(1);
}

const MAX_PAGES = Number(flag("pages", 12));
const MAX_IMAGES = Number(flag("images", 60));
const APPLY = !argv.includes("--no-apply");
const PAGE_CONCURRENCY = 8;
const IMG_CONCURRENCY = 12;
const FETCH_TIMEOUT = 10_000;
const MAX_EDGE = 1600; // px long-edge cap so builds don't choke
const WEBP_QUALITY = 72;
const MIN_IMAGE_BYTES = 6 * 1024; // below this it is an icon or a tracking pixel
const MIN_IMAGE_WIDTH = 400; // drop sprites / badges / avatars

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const host = new URL(url).hostname.replace(/^www\./, "");
const slug = (flag("slug", null) || host.split(".")[0]).replace(/[^a-z0-9]/gi, "-").toLowerCase();
const outDir = join(root, ".scrape", slug);
const pageDir = join(outDir, "pages");
const assetDir = join(outDir, "assets");
const imgDir = join(root, "public", "ingested", slug);

const abs = (u, base = url) => { try { return new URL(u, base).href; } catch { return null; } };
const sameHost = (u) => { try { return new URL(u).hostname.replace(/^www\./, "") === host; } catch { return false; } };
const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

// ── fetch helpers ────────────────────────────────────────────────────────────
async function get(u, accept = "text/html,*/*") {
  return fetch(u, {
    headers: { "User-Agent": UA, Accept: accept },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });
}
async function fetchText(u) {
  const res = await get(u);
  if (!res.ok) throw new Error(String(res.status));
  if (!(res.headers.get("content-type") || "").includes("html")) throw new Error("not html");
  return res.text();
}
async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
    }),
  );
  return out;
}

// ── color: sRGB -> OKLCH ─────────────────────────────────────────────────────
function parseColor(s) {
  s = (s || "").trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  m = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  return null;
}
function toOklch({ r, g, b }) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + Bb * Bb);
  let h = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h: Math.round(h) };
}

// ── image download (resize + webp so the build survives 60 images) ───────────
const JUNK = /sprite|favicon|pixel|tracking|1x1|spacer|placeholder|avatar|flag|badge|icon-|-icon|loader|spinner/i;
const normalizeImg = (u) => {
  try {
    const p = new URL(u);
    p.search = ""; // wordpress/shopify resize params make the same photo look unique
    p.hash = "";
    return p.href.replace(/-\d{2,4}x\d{2,4}(?=\.[a-z]{3,4}$)/i, ""); // foo-300x200.jpg -> foo.jpg
  } catch { return u; }
};
async function downloadImage(u, name) {
  try {
    const res = await get(u, "image/*");
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < MIN_IMAGE_BYTES) return null;

    let ext = (extname(new URL(u).pathname) || "").toLowerCase();
    const ct = res.headers.get("content-type") || "";
    if (!/^\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ext)) {
      ext = ct.includes("svg") ? ".svg" : ct.includes("png") ? ".png" : ct.includes("webp") ? ".webp"
        : ct.includes("avif") ? ".avif" : ct.includes("gif") ? ".gif" : ".jpg";
    }
    // SVG and animated GIF pass through: sharp would rasterize or drop frames.
    if (/\.(svg|gif)$/.test(ext)) {
      await writeFile(join(imgDir, `${name}${ext}`), buf);
      return { file: `${name}${ext}`, bytes: buf.byteLength };
    }
    const img = sharp(buf, { failOn: "none" });
    const meta = await img.metadata();
    if ((meta.width || 0) < MIN_IMAGE_WIDTH) return null;
    const out = await img
      .rotate() // honor EXIF before metadata is stripped
      .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    await writeFile(join(imgDir, `${name}.webp`), out);
    return { file: `${name}.webp`, bytes: out.byteLength, width: meta.width, height: meta.height };
  } catch { return null; }
}
async function downloadRaw(u, dir, name) {
  try {
    const res = await get(u, "image/*");
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    let ext = (extname(new URL(u).pathname) || ".png").toLowerCase().split("?")[0];
    if (!/^\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ext)) ext = ".png";
    await writeFile(join(dir, `${name}${ext}`), buf);
    return `${name}${ext}`;
  } catch { return null; }
}

const largestFromSrcset = (ss) => {
  if (!ss) return null;
  const parts = ss.split(",").map((p) => p.trim().split(/\s+/));
  parts.sort((a, b) => (parseInt(b[1]) || 0) - (parseInt(a[1]) || 0));
  return parts[0]?.[0] || null;
};

// ── parallel BFS crawl ───────────────────────────────────────────────────────
console.log(`\n${c.bold(`Cloning ${url}`)}  ${c.dim(`-> .scrape/${slug}/ + public/ingested/${slug}/`)}\n`);
await mkdir(pageDir, { recursive: true });
await mkdir(assetDir, { recursive: true });
await mkdir(imgDir, { recursive: true });

const seen = new Set([url]);
const results = new Map(); // url -> { $, html }
let frontier = [url];

while (frontier.length && results.size < MAX_PAGES) {
  const batch = frontier.slice(0, Math.min(PAGE_CONCURRENCY, MAX_PAGES - results.size));
  frontier = frontier.slice(batch.length);
  const fetched = await pool(batch, PAGE_CONCURRENCY, async (p) => {
    try { return { url: p, html: await fetchText(p) }; } catch { return null; }
  });
  for (const f of fetched) {
    if (!f) continue;
    const $ = cheerio.load(f.html);
    results.set(f.url, $);
    if (results.size >= MAX_PAGES) break;
    // enqueue same-host links, shallow paths first (they are the real nav pages)
    const found = [];
    $("a[href]").each((_, el) => {
      const u = abs($(el).attr("href"), f.url);
      if (!u || !sameHost(u)) return;
      const bare = u.split("#")[0].replace(/\/$/, "");
      if (/\.(pdf|zip|jpg|jpeg|png|webp|svg|mp4|xml|json)$/i.test(bare)) return;
      if (seen.has(bare)) return;
      seen.add(bare);
      found.push(bare);
    });
    found.sort((a, b) => a.split("/").length - b.split("/").length);
    frontier.push(...found);
  }
}

const pages = [...results.entries()].map(([u, $]) => ({ url: u, $ }));
const home = pages[0]?.$ || cheerio.load("");
const $ = home;
const meta = (sel) => $(sel).attr("content")?.trim();

// ── per-page extraction (one content file each) ───────────────────────────────
const imageUrls = new Map(); // normalized -> real url
const videoUrls = new Set();
const youtube = new Set();
const noteImage = (u) => {
  if (!u || u.startsWith("data:") || JUNK.test(u)) return;
  const key = normalizeImg(u);
  if (!imageUrls.has(key)) imageUrls.set(key, u);
};

const pageData = pages.map(({ url: pageUrl, $: p }, i) => {
  p("img").each((_, el) =>
    noteImage(abs(largestFromSrcset(p(el).attr("srcset")) || p(el).attr("src") || p(el).attr("data-src"), pageUrl)));
  p("source[srcset]").each((_, el) => noteImage(abs(largestFromSrcset(p(el).attr("srcset")), pageUrl)));
  p("[style*='background']").each((_, el) => {
    const m = (p(el).attr("style") || "").match(/url\((['"]?)(.*?)\1\)/);
    if (m) noteImage(abs(m[2], pageUrl));
  });
  p("video source[src], video[src]").each((_, el) => {
    const u = abs(p(el).attr("src"), pageUrl);
    if (u && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) videoUrls.add(u);
  });
  p("a[href], iframe[src]").each((_, el) => {
    const href = p(el).attr("href") || p(el).attr("src") || "";
    const yt = href.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (yt) youtube.add(`https://www.youtube.com/watch?v=${yt[1]}`);
  });

  const path = (() => { try { return new URL(pageUrl).pathname.replace(/\/$/, "") || "/"; } catch { return "/"; } })();
  // Section order = the order headings appear in the DOM. Mirror it when composing.
  const sections = p("h1, h2").map((_, el) => clean(p(el).text())).get().filter(Boolean).slice(0, 20);
  const subs = p("h3").map((_, el) => clean(p(el).text())).get().filter(Boolean).slice(0, 30);
  const body = p("p, li").map((_, el) => clean(p(el).text())).get().filter((t) => t.length > 40).slice(0, 40);
  const ctas = [...new Set(p("a.button, a.btn, button, [class*='btn'], [class*='button']")
    .map((_, el) => clean(p(el).text())).get().filter((t) => t && t.length < 40))].slice(0, 12);
  return { index: i, url: pageUrl, path, title: clean(p("title").text()), sections, subs, body, ctas };
});

// ── brand identity (home page) ───────────────────────────────────────────────
const name =
  meta('meta[property="og:site_name"]') || meta('meta[name="application-name"]') ||
  clean($("title").text()).split(/[|\-·]/)[0].trim() || host;
const tagline = meta('meta[property="og:title"]') || clean($("title").text()) || "";
const description = meta('meta[name="description"]') || meta('meta[property="og:description"]') || "";

const colorCount = new Map();
const noteColor = (str) => {
  for (const tok of (str || "").matchAll(/#[0-9a-fA-F]{3,6}\b|rgba?\([^)]+\)/g)) {
    const col = parseColor(tok[0]);
    if (!col) continue;
    const { C, L } = toOklch(col);
    if (C < 0.05 || L < 0.1 || L > 0.95) continue; // ignore greys, near-black, near-white
    const key = `${col.r},${col.g},${col.b}`;
    colorCount.set(key, (colorCount.get(key) || 0) + 1);
  }
};
$("[style]").each((_, el) => noteColor($(el).attr("style")));
$("style").each((_, el) => noteColor($(el).html()));
const sheets = $('link[rel="stylesheet"]').map((_, el) => abs($(el).attr("href"))).get().filter(Boolean).slice(0, 5);
for (const css of await pool(sheets, 5, async (u) => { try { return await (await get(u, "text/css")).text(); } catch { return ""; } })) {
  noteColor(css);
}
const themeColor = meta('meta[name="theme-color"]');
let brandColor = themeColor && parseColor(themeColor) ? { hex: themeColor, src: "theme-color" } : null;
if (!brandColor && colorCount.size) {
  const [top] = [...colorCount.entries()].sort((a, b) => b[1] - a[1]);
  const [r, g, b] = top[0].split(",").map(Number);
  brandColor = { hex: `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`, src: "css-frequency" };
}
const oklch = brandColor ? toOklch(parseColor(brandColor.hex)) : { h: 265 };

const fonts = new Set();
$('link[href*="fonts.googleapis.com"]').each((_, el) => {
  for (const m of ($(el).attr("href") || "").matchAll(/family=([^:&]+)/g)) {
    fonts.add(decodeURIComponent(m[1]).replace(/\+/g, " "));
  }
});

const socials = {};
const hostOf = (href) => { try { return new URL(href, url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; } };
$("a[href]").each((_, el) => {
  const href = $(el).attr("href") || "";
  if (href.startsWith("mailto:")) { socials.email ||= href.slice(7); return; }
  const h = hostOf(href);
  if (h === "github.com") socials.github ||= href;
  if (h === "twitter.com" || h === "x.com") socials.x ||= href;
  if (h === "linkedin.com") socials.linkedin ||= href;
  if (h === "instagram.com") socials.instagram ||= href;
  if (h === "facebook.com") socials.facebook ||= href;
});

// LOGO (the branded mark in the navbar/footer) is NOT the favicon (a tab icon).
const faviconUrl =
  abs($('link[rel="apple-touch-icon"]').attr("href")) ||
  abs($('link[rel="icon"]').last().attr("href")) ||
  abs("/favicon.ico");
const logoUrl = (() => {
  for (const sel of [
    "header a[href='/'] img", "nav a[href='/'] img", "footer a[href='/'] img",
    "header img[alt*='logo' i]", "nav img[alt*='logo' i]", "footer img[alt*='logo' i]",
    "[class*='logo' i] img", "[id*='logo' i] img", "header img", "nav img", "footer img",
  ]) {
    const el = $(sel).first();
    if (!el.length) continue;
    const u = abs(largestFromSrcset(el.attr("srcset")) || el.attr("src") || el.attr("data-src"));
    if (u && !u.startsWith("data:")) return u;
  }
  return null; // probably an inline <svg> mark
})();
const inlineSvgLogo = !logoUrl && $("header svg, nav svg").first().length > 0;

const ogImage = abs(meta('meta[property="og:image"]'));
if (ogImage) noteImage(ogImage);

// ── contact: whatsapp / phone / location ─────────────────────────────────────
let whatsapp = null;
$("a[href]").each((_, el) => {
  if (whatsapp) return;
  const m = ($(el).attr("href") || "").match(
    /(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=|whatsapp:\/\/send\?phone=)(\+?\d[\d\s().-]{6,})/i);
  if (m) whatsapp = m[1].replace(/\D/g, "");
});
let phone = null;
$("a[href^='tel:']").each((_, el) => { phone ||= ($(el).attr("href") || "").replace("tel:", "").trim(); });

let location = null;
$('script[type="application/ld+json"]').each((_, el) => {
  if (location) return;
  try {
    const data = JSON.parse($(el).contents().text());
    const nodes = Array.isArray(data) ? data : [data, ...(data["@graph"] || [])];
    for (const node of nodes) {
      const addr = node?.address;
      if (!addr) continue;
      const parts = typeof addr === "string" ? [addr]
        : [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode, addr.addressCountry].filter(Boolean);
      if (parts.length) {
        location = { address: parts.join(", "), lat: node.geo?.latitude ?? null, lng: node.geo?.longitude ?? null };
        break;
      }
    }
  } catch { /* malformed JSON-LD is common, ignore */ }
});
if (!location) {
  $("a[href*='google.com/maps'], a[href*='maps.app.goo.gl'], iframe[src*='google.com/maps']").each((_, el) => {
    if (location) return;
    const href = $(el).attr("href") || $(el).attr("src") || "";
    const at = href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    location = { address: clean($(el).attr("aria-label") || $(el).text()) || null, mapUrl: href, lat: at?.[1] ?? null, lng: at?.[2] ?? null };
  });
}
if (!location) { const a = clean($("address").first().text()); if (a) location = { address: a }; }
if (location) location.mapQuery = location.address || (location.lat ? `${location.lat},${location.lng}` : null);

// ── nav + footer links (the spine of the inner-page build) ───────────────────
const linksIn = (scope) => {
  const found = new Map();
  $(`${scope} a[href]`).each((_, el) => {
    const text = clean($(el).text());
    const u = abs($(el).attr("href"));
    if (!u || !text || !sameHost(u) || u.includes("#")) return;
    const path = (() => { try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return null; } })();
    if (path && path !== "/" && !found.has(path)) found.set(path, { text, path });
  });
  return [...found.values()];
};
const navItems = linksIn("header, nav");
const footerItems = linksIn("footer");

// ── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [];
$("details").each((_, el) => {
  const q = clean($(el).find("summary").first().text());
  const a = clean($(el).clone().children("summary").remove().end().text());
  if (q && a) faqs.push({ q, a });
});
$("dl dt").each((_, el) => {
  const q = clean($(el).text());
  const a = clean($(el).next("dd").text());
  if (q && a) faqs.push({ q, a });
});

// ── media download ───────────────────────────────────────────────────────────
const logoFile = logoUrl ? await downloadRaw(logoUrl, assetDir, "logo") : null;
const imgList = [...imageUrls.values()].slice(0, MAX_IMAGES);
const downloaded = (await pool(imgList, IMG_CONCURRENCY, (u, i) =>
  downloadImage(u, `img-${String(i + 1).padStart(3, "0")}`))).filter(Boolean);
const publicImages = downloaded.map((d) => `/ingested/${slug}/${d.file}`);

// ── write the workspace ──────────────────────────────────────────────────────
const mdList = (arr, f = (x) => x) => (arr.length ? arr.map((x) => `- ${f(x)}`).join("\n") : "_(none found)_");
const fileNameFor = (p) => {
  const base = p.path === "/" ? "home" : p.path.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return `${String(p.index).padStart(2, "0")}-${base}.md`;
};

await pool(pageData, 8, (p) =>
  writeFile(join(pageDir, fileNameFor(p)),
    `# ${p.title || p.path}\n\nRoute to build: \`${p.path}\`\nSource: ${p.url}\n\n` +
    `## Section order (mirror this)\n${mdList(p.sections)}\n\n` +
    `## Sub-headings\n${mdList(p.subs)}\n\n` +
    `## Copy (sharpen, do not paste verbatim)\n${mdList(p.body)}\n\n` +
    `## Buttons / CTAs\n${mdList(p.ctas)}\n`));

const homePage = pageData[0] || { sections: [] };
const innerPages = pageData.slice(1).map((p) => ({
  path: p.path, title: p.title, sections: p.sections.slice(0, 8), content: `pages/${fileNameFor(p)}`,
}));

const brandJson = {
  source: url,
  sourceHost: host,
  slug,
  pagesCrawled: pageData.length,
  name,
  tagline: clean(tagline),
  description: clean(description),
  brandColor: brandColor ? { ...brandColor, oklchHue: oklch.h } : null,
  theme: { hue: oklch.h },
  fonts: [...fonts],
  // logo = navbar/footer mark. favicon = browser tab icon. Never interchange them.
  logo: logoFile ? `assets/${logoFile}` : null,
  logoNote: logoFile ? null
    : inlineSvgLogo ? "Inline <svg> logo in header. Recreate it in components/icons.tsx"
    : "Logo not auto-found. Grab the navbar mark by hand",
  favicon: faviconUrl || null,
  images: publicImages,
  imageCount: publicImages.length,
  social: socials,
  contact: { whatsapp, phone, address: location?.address || null, mapQuery: location?.mapQuery || null },
  sectionOrder: homePage.sections,
  navItems,
  footerItems,
  innerPages,
  faqCount: faqs.length,
};
await writeFile(join(outDir, "brand.json"), JSON.stringify(brandJson, null, 2) + "\n");
await writeFile(join(outDir, "media.json"),
  JSON.stringify({ images: publicImages, videos: [...videoUrls], youtube: [...youtube] }, null, 2) + "\n");
await writeFile(join(outDir, "faq.md"),
  `# ${name} FAQ (scraped)\n\n${faqs.length ? faqs.map((f) => `### ${f.q}\n${f.a}\n`).join("\n") : "_None found. Write Q&A here for the widget._\n"}`);
await writeFile(join(outDir, "plan.md"),
  `# ${name} build plan\n\nSource: ${url}\nPages crawled: ${pageData.length}\nImages: ${publicImages.length} in \`public/ingested/${slug}/\`\n\n` +
  `## Home section order (mirror this chronology)\n${mdList(homePage.sections)}\n\n` +
  `## Inner pages (one route each, full polish)\n${mdList(innerPages, (p) => `\`${p.path}\` ${p.title || ""} -> ${p.content}`)}\n\n` +
  `## Nav\n${mdList(navItems, (l) => `${l.text} -> ${l.path}`)}\n\n## Footer\n${mdList(footerItems, (l) => `${l.text} -> ${l.path}`)}\n\n` +
  `## Contact\n- WhatsApp: ${whatsapp || "(none)"}\n- Phone: ${phone || "(none)"}\n- Address: ${location?.address || "(none)"}\n`);

console.log(`  ${c.dim("name")}      ${c.cyan(name)}`);
console.log(`  ${c.dim("color")}     ${brandColor ? `${brandColor.hex} (${brandColor.src}) -> hue ${oklch.h}` : "not found"}`);
console.log(`  ${c.dim("fonts")}     ${[...fonts].join(", ") || "none detected"}`);
console.log(`  ${c.dim("logo")}      ${logoFile ? c.cyan(`assets/${logoFile}`) : inlineSvgLogo ? "inline <svg> in header (recreate by hand)" : "NOT FOUND"}`);
console.log(`  ${c.dim("images")}    ${c.bold(publicImages.length)} ${publicImages.length < 30 ? c.dim("(thin: top up with Unsplash/Pexels)") : c.green("ok")}`);
console.log(`  ${c.dim("pages")}     ${pageData.length} crawled, ${c.bold(innerPages.length)} inner routes to build`);
console.log(`  ${c.dim("media")}     ${videoUrls.size} video, ${youtube.size} youtube`);
console.log(`  ${c.dim("contact")}   whatsapp ${whatsapp || "none"}, phone ${phone || "none"}, address ${location?.address ? c.cyan("yes") : "none"}`);
console.log(`  ${c.dim("faqs")}      ${faqs.length}`);

if (APPLY) {
  const cfgPath = join(root, "brand.config.ts");
  let cfg = await readFile(cfgPath, "utf8");
  const setStr = (key, val) =>
    (cfg = cfg.replace(new RegExp(`(${key}:\\s*")[^"]*(")`), `$1${String(val).replace(/"/g, '\\"')}$2`));
  setStr("name", name);
  if (clean(tagline)) setStr("tagline", clean(tagline).slice(0, 90));
  if (clean(description)) setStr("description", clean(description).slice(0, 160));
  if (whatsapp) setStr("whatsapp", whatsapp);
  if (phone) setStr("phone", phone);
  if (location?.address) setStr("address", location.address.slice(0, 120));
  if (location?.mapQuery) setStr("mapQuery", location.mapQuery.slice(0, 120));
  cfg = cfg.replace(/(hue:\s*)\d+/, `$1${oklch.h}`);
  if (fonts.size) {
    const f = [...fonts];
    cfg = cfg.replace(/(display:\s*")[^"]*(")/, `$1${f[0]}$2`);
    if (f[1]) cfg = cfg.replace(/(sans:\s*")[^"]*(")/, `$1${f[1]}$2`);
  }
  await writeFile(cfgPath, cfg);

  await mkdir(join(root, "content"), { recursive: true });
  await writeFile(join(root, "content", "knowledge.md"),
    `# ${name} knowledge base\n\nThe FAQ widget answers only from this file. Keep it factual.\n\n` +
    `## About\n${clean(description) || clean(tagline)}\n\n` +
    `## Contact\n- Phone: ${phone || "(none)"}\n- WhatsApp: ${whatsapp || "(none)"}\n- Address: ${location?.address || "(none)"}\n\n` +
    `## FAQ\n${faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") || "(add Q&A)"}\n\n` +
    `## Highlights\n${homePage.sections.map((h) => `- ${h}`).join("\n")}\n`);
  console.log(`\n  ${c.green("applied")} -> brand.config.ts + content/knowledge.md   ${c.dim("next: npm run brand")}`);
}

// Non-zero exit if the scrape came back empty: the caller should notice, not guess.
if (!pageData.length) { console.error(`\n${c.bold("Clone failed: no pages fetched.")}\n`); process.exit(1); }
console.log(`\n${c.green("Clone complete.")}  ${c.dim(`.scrape/${slug}/plan.md`)}\n`);
