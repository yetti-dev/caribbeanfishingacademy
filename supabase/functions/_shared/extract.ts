/**
 * HTML extraction, using a real DOM rather than regex.
 *
 * Regex parsing of markup breaks on the things that matter here: srcset lists,
 * nested nav, <picture>, entity-encoded text. deno-dom is a proper parser and the
 * bundle cost is worth it for a crawler that has to survive arbitrary sites.
 */
import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom@0.1.49";

export type Extracted = {
  title: string | null;
  description: string | null;
  siteName: string | null;
  headings: { level: number; text: string }[];
  paragraphs: string[];
  ctas: string[];
  links: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
  images: { url: string; alt: string | null; width?: number; height?: number }[];
  videos: string[];
  youtube: string[];
  colors: string[];
  fonts: string[];
  contact: {
    phone?: string; whatsapp?: string; email?: string; address?: string;
    instagram?: string; facebook?: string; x?: string; linkedin?: string;
  };
  logo: string | null;
  favicon: string | null;
};

const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const abs = (href: string | null, base: string) => {
  if (!href) return null;
  try { return new URL(href, base).href; } catch { return null; }
};

/** Biggest candidate in a srcset, since that is the one worth storing. */
function fromSrcset(srcset: string | null): string | null {
  if (!srcset) return null;
  const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
  parts.sort((a, b) => (parseInt(b[1] ?? "0") || 0) - (parseInt(a[1] ?? "0") || 0));
  return parts[0]?.[0] ?? null;
}

/** Sprites, tracking pixels and flags are noise, not content. */
const JUNK = /sprite|favicon|pixel|tracking|1x1|spacer|placeholder|avatar|flag|badge|icon[-_]|[-_]icon|loader|spinner|logo[-_]?small/i;

export function extract(html: string, pageUrl: string): Extracted {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) throw new Error("could not parse html");

  const meta = (sel: string, attr = "content") => clean(doc.querySelector(sel)?.getAttribute(attr) ?? "") || null;
  const all = <T extends Element>(sel: string) => Array.from(doc.querySelectorAll(sel)) as unknown as T[];

  /*
   * Headings, in DOM order: this is the section chronology to mirror.
   *
   * Real h1-h3 first. Many site builders (GoDaddy, Wix, Squarespace) emit styled
   * divs instead, so a strict selector returned zero headings on pages that
   * clearly had them. The fallback accepts explicit ARIA headings and the class
   * naming those builders use, which is imperfect but far better than treating
   * the page as heading-less.
   */
  const semantic = all<Element>("h1, h2, h3")
    .map((el) => ({ level: Number(el.tagName.slice(1)), text: clean(el.textContent) }))
    .filter((h) => h.text.length > 1 && h.text.length < 200);

  /*
   * Typographic fallback, for builders that ship no heading tags at all.
   *
   * Measured on a GoDaddy built site: zero h1-h4, no role="heading", no
   * aria-level. Headings were <p> and <span> inside .wsb-element-text carrying an
   * inline font-size. A class-name heuristic finds nothing there, so infer from
   * type size instead: collect every inline font-size, take the median as the body
   * size, and treat short text at 1.35x or more as a heading. Level comes from how
   * far above the median it sits.
   *
   * This is a heuristic and says so. It beats reporting a page as heading-less
   * when a human can plainly see the headings.
   */
  const sized: { px: number; text: string }[] = [];
  for (const el of all<Element>("[style*='font-size']")) {
    const px = Number((el.getAttribute("style") ?? "").match(/font-size:\s*([\d.]+)px/i)?.[1]);
    if (!px) continue;
    const text = clean(el.textContent);
    if (text.length < 3 || text.length > 120) continue;
    sized.push({ px, text });
  }
  const median = (() => {
    if (!sized.length) return 0;
    const xs = sized.map((x) => x.px).sort((a, b) => a - b);
    return xs[Math.floor(xs.length / 2)];
  })();
  const typographic = median
    ? sized
        .filter((x) => x.px >= median * 1.35)
        .map((x) => ({
          level: x.px >= median * 2 ? 1 : x.px >= median * 1.6 ? 2 : 3,
          text: x.text,
        }))
    : [];

  const ariaOrClassy = all<Element>('[role="heading"]')
    .map((el) => ({
      level: Number(el.getAttribute("aria-level") ?? "") || 2,
      text: clean(el.textContent),
    }))
    .filter((h) => h.text.length > 2 && h.text.length < 120);

  const seenHeading = new Set<string>();
  const headings = [...semantic, ...(semantic.length ? [] : [...ariaOrClassy, ...typographic])]
    .filter((h) => {
      const k = h.text.toLowerCase();
      if (seenHeading.has(k)) return false;
      seenHeading.add(k);
      return true;
    })
    .slice(0, 60);

  const paragraphs = all<Element>("p, li")
    .map((el) => clean(el.textContent))
    .filter((t) => t.length > 40 && t.length < 900)
    .slice(0, 60);

  const ctas = [...new Set(
    all<Element>("a.button, a.btn, button, [class*='btn'], [class*='button'], [role='button']")
      .map((el) => clean(el.textContent))
      .filter((t) => t && t.length < 40),
  )].slice(0, 20);

  /* internal links, for the crawl frontier */
  const origin = new URL(pageUrl).origin;
  const host = new URL(pageUrl).hostname.replace(/^www\./, "");
  const links: { href: string; label: string }[] = [];
  const seenHref = new Set<string>();
  for (const a of all<Element>("a[href]")) {
    const href = abs(a.getAttribute("href"), pageUrl);
    if (!href) continue;
    let u: URL;
    try { u = new URL(href); } catch { continue; }
    if (u.hostname.replace(/^www\./, "") !== host) continue;
    if (!/^https?:$/.test(u.protocol)) continue;
    // Fragments and query variants are the same page for crawling purposes.
    u.hash = ""; u.search = "";
    const norm = u.href.replace(/\/$/, "") || origin;
    if (seenHref.has(norm)) continue;
    if (/\.(pdf|zip|docx?|xlsx?|jpe?g|png|webp|gif|svg|mp4|mp3)$/i.test(u.pathname)) continue;
    seenHref.add(norm);
    links.push({ href: norm, label: clean(a.textContent).slice(0, 80) });
  }

  /* FAQ: real <details> first, then the heading-followed-by-text pattern */
  const faqs: { q: string; a: string }[] = [];
  for (const d of all<Element>("details")) {
    const q = clean(d.querySelector("summary")?.textContent ?? "");
    const a = clean(d.textContent).replace(q, "").trim();
    if (q && a) faqs.push({ q, a: a.slice(0, 600) });
  }
  if (!faqs.length) {
    for (const h of all<Element>("h3, h4, dt")) {
      const q = clean(h.textContent);
      if (!/\?$/.test(q)) continue;
      const next = h.nextElementSibling;
      const a = clean(next?.textContent ?? "");
      if (q && a.length > 20) faqs.push({ q, a: a.slice(0, 600) });
    }
  }

  /* images: img, srcset, <picture>, and CSS background-image */
  const images: { url: string; alt: string | null; width?: number; height?: number }[] = [];
  const seenImg = new Set<string>();
  const pushImg = (raw: string | null, alt: string | null, w?: string | null, h?: string | null) => {
    const u = abs(raw, pageUrl);
    if (!u) return;
    let n: URL;
    try { n = new URL(u); } catch { return; }
    if (n.protocol === "data:") return;

    /*
     * The dedup KEY and the fetch URL are not the same thing, and conflating them
     * cost us every image on a GoDaddy built site.
     *
     * Stripping the query is right for WordPress and Shopify, where ?w=300&h=200
     * makes one photo look like twenty. It is wrong for CDNs where the query IS
     * the image: nebula.wsimg.com/<hash> without its params returns a few hundred
     * bytes, so all 26 assets were skipped as tracking pixels.
     *
     * So normalise for comparison, but always keep the original URL to fetch.
     */
    const keyUrl = new URL(n.href);
    keyUrl.search = ""; keyUrl.hash = "";
    const key = keyUrl.href.replace(/-\d{2,4}x\d{2,4}(?=\.[a-z]{3,4}$)/i, "");
    if (seenImg.has(key) || JUNK.test(key)) return;
    seenImg.add(key);
    images.push({
      url: n.href,                     // fetch this
      alt: alt ? clean(alt) : null,
      width: w ? Number(w) || undefined : undefined,
      height: h ? Number(h) || undefined : undefined,
    });
  };
  for (const img of all<Element>("img")) {
    pushImg(
      fromSrcset(img.getAttribute("srcset")) ?? img.getAttribute("src") ?? img.getAttribute("data-src"),
      img.getAttribute("alt"), img.getAttribute("width"), img.getAttribute("height"),
    );
  }
  for (const s of all<Element>("source[srcset]")) pushImg(fromSrcset(s.getAttribute("srcset")), null);
  for (const el of all<Element>("[style*='background']")) {
    const m = (el.getAttribute("style") ?? "").match(/url\((['"]?)(.*?)\1\)/);
    if (m) pushImg(m[2], null);
  }

  const videos = [...new Set(all<Element>("video source[src], video[src]")
    .map((el) => abs(el.getAttribute("src"), pageUrl))
    .filter((u): u is string => Boolean(u) && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u!)))];

  const youtube = [...new Set(all<Element>("a[href], iframe[src]")
    .map((el) => el.getAttribute("href") ?? el.getAttribute("src") ?? "")
    .map((h) => h.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1])
    .filter((v): v is string => Boolean(v))
    .map((v) => `https://www.youtube.com/watch?v=${v}`))];

  /* brand signals: inline styles and theme-color are the honest ones */
  const colorSet = new Set<string>();
  const themeColor = meta('meta[name="theme-color"]');
  if (themeColor) colorSet.add(themeColor);
  const styleText = all<Element>("style").map((s) => s.textContent ?? "").join("\n").slice(0, 200_000);
  for (const m of styleText.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) colorSet.add(`#${m[1]}`);
  for (const m of styleText.matchAll(/rgba?\(\s*[\d.\s,%/]+\)/gi)) colorSet.add(m[0]);

  const fontSet = new Set<string>();
  for (const m of styleText.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
    const first = m[1].split(",")[0].replace(/['"]/g, "").trim();
    if (first && !/^(inherit|initial|unset|var)/i.test(first)) fontSet.add(first);
  }
  for (const link of all<Element>('link[href*="fonts.googleapis.com"]')) {
    for (const m of (link.getAttribute("href") ?? "").matchAll(/family=([^:&]+)/g)) {
      fontSet.add(decodeURIComponent(m[1]).replace(/\+/g, " "));
    }
  }

  /* contact */
  const bodyText = clean(doc.body?.textContent ?? "").slice(0, 40_000);
  const telHref = all<Element>('a[href^="tel:"]')[0]?.getAttribute("href")?.replace(/^tel:/, "");
  const mailHref = all<Element>('a[href^="mailto:"]')[0]?.getAttribute("href")?.replace(/^mailto:/, "");
  const waHref = all<Element>('a[href*="wa.me"], a[href*="api.whatsapp.com"]')[0]?.getAttribute("href") ?? "";
  const social = (needle: string) =>
    all<Element>(`a[href*="${needle}"]`)[0]?.getAttribute("href") ?? undefined;

  const contact = {
    phone: clean(telHref ?? "") || bodyText.match(/\+\d[\d\s().-]{7,}\d/)?.[0]?.trim() || undefined,
    whatsapp: waHref.match(/(\d{7,15})/)?.[1] ?? undefined,
    email: clean(mailHref ?? "") || bodyText.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)?.[0] || undefined,
    address: clean(all<Element>("address")[0]?.textContent ?? "") || undefined,
    instagram: social("instagram.com"),
    facebook: social("facebook.com"),
    x: social("twitter.com") ?? social("x.com"),
    linkedin: social("linkedin.com"),
  };

  /* logo: prefer an <img> inside the header or a link home */
  const logoEl =
    doc.querySelector("header img, [class*='logo'] img, a[href='/'] img") ??
    doc.querySelector("img[alt*='logo' i]");
  const logo = abs(logoEl?.getAttribute("src") ?? fromSrcset(logoEl?.getAttribute("srcset") ?? null), pageUrl);
  const favicon = abs(
    doc.querySelector('link[rel*="icon"]')?.getAttribute("href") ?? "/favicon.ico",
    pageUrl,
  );

  return {
    title: clean(doc.querySelector("title")?.textContent ?? "") || null,
    description: meta('meta[name="description"]') ?? meta('meta[property="og:description"]'),
    siteName: meta('meta[property="og:site_name"]') ?? meta('meta[name="application-name"]'),
    headings, paragraphs, ctas, links, faqs, images, videos, youtube,
    colors: [...colorSet].slice(0, 40),
    fonts: [...fontSet].slice(0, 12),
    contact, logo, favicon,
  };
}
