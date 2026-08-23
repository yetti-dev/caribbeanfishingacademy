import "server-only";

/**
 * Media safety for operator-supplied assets: uploads and ad-hoc URL grabs.
 *
 * Mirrors supabase/functions/_shared/safety.ts. The duplication is deliberate:
 * that copy runs in Deno Edge, this one in Node inside the dashboard, and neither
 * can import the other. The rules must not diverge, because both write into the
 * same bucket and Storage content is later served from a client's own domain.
 *
 * An operator uploading a file is trusted more than a scraped page, but not
 * infinitely: a browser will happily send a renamed executable, and an SVG from
 * anywhere is a stored-XSS vector.
 */

export type Sniffed = { type: string; mime: string; width?: number; height?: number };

const ascii = (b: Uint8Array, n = 32) =>
  Array.from(b.subarray(0, n)).map((c) => String.fromCharCode(c)).join("");

/** Identify by content and read dimensions from the header where it carries them. */
export function sniff(b: Uint8Array): Sniffed | null {
  if (b.length < 16) return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const a = ascii(b);

  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    // Walk the JPEG segment chain to SOF for real dimensions.
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { type: "jpg", mime: "image/jpeg", height: dv.getUint16(i + 5), width: dv.getUint16(i + 7) };
      }
      i += 2 + dv.getUint16(i + 2);
    }
    return { type: "jpg", mime: "image/jpeg" };
  }
  if (a.startsWith("\x89PNG\r\n\x1a\n")) {
    return { type: "png", mime: "image/png", width: dv.getUint32(16), height: dv.getUint32(20) };
  }
  if (a.startsWith("GIF87a") || a.startsWith("GIF89a")) {
    return { type: "gif", mime: "image/gif", width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
  }
  if (a.startsWith("RIFF") && ascii(b.subarray(8), 4) === "WEBP") {
    const cc = ascii(b.subarray(12), 4);
    if (cc === "VP8X") {
      return {
        type: "webp", mime: "image/webp",
        width: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
        height: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1,
      };
    }
    if (cc === "VP8 ") {
      return { type: "webp", mime: "image/webp", width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
    }
    return { type: "webp", mime: "image/webp" };
  }
  if (ascii(b.subarray(4), 4) === "ftyp") {
    const brand = ascii(b.subarray(8), 4);
    if (/avif|avis/.test(brand)) return { type: "avif", mime: "image/avif" };
    if (/heic|heix|mif1/.test(brand)) return { type: "heic", mime: "image/heic" };
    return { type: "mp4", mime: "video/mp4" };
  }
  if (a.startsWith("\x1aE\xdf\xa3")) return { type: "webm", mime: "video/webm" };
  if (/^\s*(<\?xml[^>]*\?>\s*)?(<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(ascii(b, 400))) {
    return { type: "svg", mime: "image/svg+xml" };
  }
  if (a.startsWith("%PDF-")) return { type: "pdf", mime: "application/pdf" };
  if (b[0] === 0x4d && b[1] === 0x5a) return { type: "exe", mime: "application/octet-stream" };
  if (b[0] === 0x7f && ascii(b.subarray(1), 3) === "ELF") return { type: "elf", mime: "application/octet-stream" };
  if (a.startsWith("PK\x03\x04")) return { type: "zip", mime: "application/zip" };
  if (a.startsWith("#!")) return { type: "script", mime: "text/plain" };
  return null;
}

export const REFUSED = new Set(["exe", "elf", "zip", "script", "pdf"]);
export const STORABLE = new Set(["jpg", "png", "gif", "webp", "avif", "heic", "svg", "mp4", "webm"]);

/** Strip active content from an SVG, then assert nothing survived. */
export function sanitizeSvg(input: string) {
  let svg = input;
  svg = svg.replace(/<!(DOCTYPE|ENTITY)[\s\S]*?>/gi, "");
  svg = svg.replace(/<\s*(script|foreignObject|iframe|embed|object|handler|set|animate|animateMotion|animateTransform|audio|video)\b[\s\S]*?(<\/\s*\1\s*>|\/>)/gi, "");
  svg = svg.replace(/<\s*(script|foreignObject|iframe|embed|object|use|handler|set|animate)\b[^>]*\/?>/gi, "");
  svg = svg.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  svg = svg.replace(/\s(?:href|xlink:href)\s*=\s*("(?:javascript|vbscript|data):[^"]*"|'(?:javascript|vbscript|data):[^']*')/gi, "");
  svg = svg.replace(/\s(?:href|xlink:href)\s*=\s*("https?:\/\/[^"]*"|'https?:\/\/[^']*')/gi, "");
  const bad: string[] = [];
  if (/<\s*script\b/i.test(svg)) bad.push("<script>");
  if (/<\s*foreignObject\b/i.test(svg)) bad.push("<foreignObject>");
  if (/\son[a-z]+\s*=/i.test(svg)) bad.push("on* handler");
  if (/javascript\s*:/i.test(svg)) bad.push("javascript: url");
  return { svg, clean: bad.length === 0, findings: bad };
}

/* ── SSRF ─────────────────────────────────────────────────────────────────── */

function isPrivateIp(ip: string): boolean {
  if (ip.includes(":")) {
    const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
    if (v === "::1" || v === "::") return true;
    if (/^f[cd]/.test(v) || /^fe[89ab]/.test(v)) return true;
    const dotted = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (dotted) return isPrivateIp(dotted[1]);
    // The URL parser rewrites ::ffff:10.0.0.1 to ::ffff:a00:1, so the dotted
    // form alone would let 10/8 through.
    const hex = v.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
      const hi = parseInt(hex[1], 16), lo = parseInt(hex[2], 16);
      return isPrivateIp([hi >> 8, hi & 255, lo >> 8, lo & 255].join("."));
    }
    return false;
  }
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some(Number.isNaN)) return true;
  const [a, b] = p;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;   // cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

const BLOCKED = new Set(["localhost", "metadata.google.internal", "metadata.goog", "instance-data"]);

export function assertPublicUrl(raw: string): URL {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error(`not a url: ${raw.slice(0, 80)}`); }
  if (!/^https?:$/.test(url.protocol)) throw new Error(`blocked scheme ${url.protocol}`);
  const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (BLOCKED.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new Error(`blocked host ${host}`);
  }
  if (/^[\d.]+$/.test(host) || host.includes(":")) {
    if (isPrivateIp(host)) throw new Error(`blocked private address ${host}`);
  }
  return url;
}

/** Fetch with the SSRF check repeated after every redirect, plus a byte cap. */
export async function safeFetch(raw: string, opts: { accept?: string; maxBytes?: number; timeoutMs?: number } = {}) {
  const { accept = "*/*", maxBytes = 25 * 1024 * 1024, timeoutMs = 20_000 } = opts;
  let current = raw;
  for (let hop = 0; hop <= 4; hop++) {
    assertPublicUrl(current);
    const res = await fetch(current, {
      headers: { Accept: accept, "User-Agent": "Mozilla/5.0 (compatible; WebsiteFactory/1.0)" },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) break;
      current = new URL(loc, current).href;   // re-vetted at the top of the loop
      continue;
    }
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > maxBytes) throw new Error(`too large (${declared} bytes)`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error(`exceeded ${maxBytes} bytes`);
    return { res, bytes, url: current };
  }
  throw new Error("too many redirects");
}

/** Image URLs on a page: img, srcset, <picture>, and CSS backgrounds. */
export function extractImageUrls(html: string, pageUrl: string): { url: string; alt: string | null }[] {
  const out: { url: string; alt: string | null }[] = [];
  const seen = new Set<string>();
  const abs = (u: string) => { try { return new URL(u, pageUrl).href; } catch { return null; } };
  const push = (raw: string | null | undefined, alt: string | null) => {
    if (!raw) return;
    const u = abs(raw.trim());
    if (!u || u.startsWith("data:")) return;
    // Normalise for dedup only. The original URL is kept, because on some CDNs
    // the query string IS the image and stripping it returns a placeholder.
    let key: string;
    try { const k = new URL(u); k.search = ""; k.hash = ""; key = k.href; } catch { key = u; }
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ url: u, alt });
  };
  const biggest = (srcset: string) => {
    const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
    parts.sort((a, b) => (parseInt(b[1] ?? "0") || 0) - (parseInt(a[1] ?? "0") || 0));
    return parts[0]?.[0];
  };

  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    const tag = m[1];
    const srcset = tag.match(/srcset\s*=\s*["']([^"']+)["']/i)?.[1];
    const src = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
      ?? tag.match(/data-src\s*=\s*["']([^"']+)["']/i)?.[1];
    const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? null;
    push(srcset ? biggest(srcset) : src, alt);
  }
  for (const m of html.matchAll(/<source\b[^>]*srcset\s*=\s*["']([^"']+)["'][^>]*>/gi)) push(biggest(m[1]), null);
  for (const m of html.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)) {
    if (/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/i.test(m[2])) push(m[2], null);
  }
  return out;
}
