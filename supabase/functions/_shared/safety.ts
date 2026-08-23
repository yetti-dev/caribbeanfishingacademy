/**
 * Safety primitives for scraping a stranger's website.
 *
 * The threat model is the same one that already bit the local scraper:
 *  1. Any URL off a scraped page is an SSRF primitive. A single <img> pointing at
 *     169.254.169.254 would have the worker fetch cloud metadata.
 *  2. Assets land in Storage and are later served from the client's own domain.
 *     An SVG carrying <script> is same-origin stored XSS.
 *  3. Extensions and content-types are attacker controlled. Magic bytes are not.
 *  4. Scraped copy is read by build agents, so "ignore previous instructions" in
 *     page text is an attack on the build, not just noise.
 */

/* ── SSRF ─────────────────────────────────────────────────────────────────── */

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip.includes(":")) {
    const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
    if (v === "::1" || v === "::") return true;
    if (/^f[cd]/.test(v)) return true;      // unique local
    if (/^fe[89ab]/.test(v)) return true;   // link local
    const dotted = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (dotted) return isPrivateIp(dotted[1]);
    // The URL parser rewrites ::ffff:10.0.0.1 to the hex form ::ffff:a00:1, so
    // matching only the dotted quad lets 10/8 straight through.
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
  if (a === 169 && b === 254) return true;            // includes cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;  // CGNAT
  if (a >= 224) return true;
  return false;
}

const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal", "metadata.goog", "instance-data"]);

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error(`not a url: ${raw.slice(0, 80)}`); }
  if (!/^https?:$/.test(url.protocol)) throw new Error(`blocked scheme ${url.protocol}`);
  const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new Error(`blocked host ${host}`);
  }
  if (/^[\d.]+$/.test(host) || host.includes(":")) {
    if (isPrivateIp(host)) throw new Error(`blocked private address ${host}`);
    return url;
  }
  // Deno.resolveDns needs --allow-net for the resolver and is unavailable on the
  // hosted runtime, so a literal-IP check plus the host denylist is what we get.
  // Redirects are handled manually below, which is the more important half.
  return url;
}

/** Manual redirect handling: a 302 must not hop to a private address post-check. */
export async function safeFetch(raw: string, opts: {
  accept?: string; timeoutMs?: number; maxBytes?: number; maxRedirects?: number; ua?: string;
} = {}) {
  const { accept = "*/*", timeoutMs = 15_000, maxBytes = 12 * 1024 * 1024, maxRedirects = 4, ua } = opts;
  let current = raw;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    await assertPublicUrl(current);
    const res = await fetch(current, {
      headers: { Accept: accept, ...(ua ? { "User-Agent": ua } : {}) },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { res, bytes: new Uint8Array(), url: current };
      current = new URL(loc, current).href;   // re-vetted at the top of the loop
      continue;
    }
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > maxBytes) throw new Error(`too large (${declared} bytes)`);
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength > maxBytes) throw new Error(`exceeded ${maxBytes} bytes`);
    return { res, bytes: buf, url: current };
  }
  throw new Error("too many redirects");
}

/* ── magic bytes ──────────────────────────────────────────────────────────── */

const ascii = (b: Uint8Array, n = 32) => Array.from(b.slice(0, n)).map((c) => String.fromCharCode(c)).join("");

export type Sniffed = { type: string; mime: string; width?: number; height?: number } | null;

/**
 * Identify by content and read dimensions where the header carries them. There is
 * no image library on this runtime, so the sizes come from parsing the header
 * directly. Worth it: dimensions decide whether a photo is a hero or an icon.
 */
export function sniff(b: Uint8Array): Sniffed {
  if (b.length < 16) return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const a = ascii(b);

  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    // JPEG: walk the segment chain to SOF for the real dimensions.
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
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
  if (a.startsWith("RIFF") && ascii(b.slice(8), 4) === "WEBP") {
    const fourcc = ascii(b.slice(12), 4);
    if (fourcc === "VP8X") {
      const w = (b[24] | (b[25] << 8) | (b[26] << 16)) + 1;
      const h = (b[27] | (b[28] << 8) | (b[29] << 16)) + 1;
      return { type: "webp", mime: "image/webp", width: w, height: h };
    }
    if (fourcc === "VP8 ") return { type: "webp", mime: "image/webp", width: dv.getUint16(26, true) & 0x3fff, height: dv.getUint16(28, true) & 0x3fff };
    if (fourcc === "VP8L") return { type: "webp", mime: "image/webp" };
    return { type: "webp", mime: "image/webp" };
  }
  if (ascii(b.slice(4), 4) === "ftyp") {
    const brand = ascii(b.slice(8), 4);
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
  if (b[0] === 0x7f && a.slice(1, 4) === "ELF") return { type: "elf", mime: "application/octet-stream" };
  if (a.startsWith("PK\x03\x04")) return { type: "zip", mime: "application/zip" };
  if (a.startsWith("#!")) return { type: "script", mime: "text/plain" };
  return null;
}

export const DANGEROUS = new Set(["exe", "elf", "zip", "script", "pdf"]);
export const STORABLE = new Set(["jpg", "png", "gif", "webp", "avif", "heic", "svg", "mp4", "webm"]);

/* ── SVG sanitising ───────────────────────────────────────────────────────── */

/** Strip every active element. Delete rather than rewrite, then assert. */
export function sanitizeSvg(input: string): { svg: string; removed: string[] } {
  let svg = input;
  const removed: string[] = [];
  const step = (label: string, next: string) => {
    if (next !== svg) removed.push(label);
    svg = next;
  };
  step("doctype/entity", svg.replace(/<!(DOCTYPE|ENTITY)[\s\S]*?>/gi, ""));
  step("active elements", svg.replace(
    /<\s*(script|foreignObject|iframe|embed|object|handler|set|animate|animateMotion|animateTransform|audio|video)\b[\s\S]*?(<\/\s*\1\s*>|\/>)/gi, ""));
  step("active tags", svg.replace(
    /<\s*(script|foreignObject|iframe|embed|object|use|handler|set|animate)\b[^>]*\/?>/gi, ""));
  step("event handlers", svg.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, ""));
  step("script urls", svg.replace(
    /\s(?:href|xlink:href)\s*=\s*("(?:javascript|vbscript|data):[^"]*"|'(?:javascript|vbscript|data):[^']*')/gi, ""));
  step("external refs", svg.replace(/\s(?:href|xlink:href)\s*=\s*("https?:\/\/[^"]*"|'https?:\/\/[^']*')/gi, ""));
  return { svg, removed };
}

export function svgIsClean(svg: string) {
  const bad: string[] = [];
  if (/<\s*script\b/i.test(svg)) bad.push("<script>");
  if (/<\s*foreignObject\b/i.test(svg)) bad.push("<foreignObject>");
  if (/\son[a-z]+\s*=/i.test(svg)) bad.push("on* handler");
  if (/javascript\s*:/i.test(svg)) bad.push("javascript: url");
  if (/<!ENTITY/i.test(svg)) bad.push("<!ENTITY>");
  return { clean: bad.length === 0, findings: bad };
}

/* ── prompt injection in scraped copy ─────────────────────────────────────── */

const INJECTION: { name: string; re: RegExp }[] = [
  { name: "instruction-override", re: /\b(?:ignore|disregard|forget)\s+(?:all\s+)?(?:your\s+|the\s+)?(?:previous|prior|above|earlier|preceding)\s+(?:instructions?|prompts?|rules?)/i },
  { name: "role-reassignment", re: /\byou\s+are\s+now\s+(?:a|an|the)\b/i },
  { name: "fake-system-turn", re: /(?:^|\n)\s*(?:system|assistant)\s*:\s*/i },
  { name: "system-tag", re: /<\/?(?:system|system-reminder|important_instructions)>/i },
  { name: "exfiltration", re: /\b(?:send|post|upload|exfiltrate|leak)\b[^\n]{0,40}(?:\.env\b|api[_\s-]?keys?\b|\btokens?\b|\bsecrets?\b|\bcredentials?\b)/i },
  { name: "script-injection", re: /\b(?:add|insert|include|inject)\b[^\n]{0,30}<script/i },
  { name: "shell-command", re: /\b(?:run|execute)\b[^\n]{0,20}(?:curl|wget|bash|sh\s+-c|npm\s+i)/i },
];

export const scanInjection = (text: string) =>
  INJECTION.filter(({ re }) => re.test(text)).map(({ name }) => name);
