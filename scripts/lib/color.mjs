/**
 * OKLCH parsing and WCAG contrast, so "the colours are good" is a check and not
 * an opinion.
 *
 * The token system in app/globals.css is OKLCH and derives everything from one
 * --brand-hue, which means a scraped hue can silently produce unreadable pairs:
 * dark text on a dark primary, muted-on-muted, a hero nobody can read. This
 * resolves the variables, converts to sRGB, and measures the pairs that actually
 * get rendered together.
 */

/* ── OKLCH -> sRGB ────────────────────────────────────────────────────────── */

const clamp01 = (n) => Math.min(1, Math.max(0, n));

/** sRGB gamma encode from linear. */
const encode = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

/** OKLab -> linear sRGB (Björn Ottosson's matrices). */
export function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [clamp01(encode(clamp01(r))), clamp01(encode(clamp01(g))), clamp01(encode(clamp01(bb)))];
}

/** Relative luminance per WCAG 2.1. */
export function luminance([r, g, b]) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(rgbA, rgbB) {
  const a = luminance(rgbA), b = luminance(rgbB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");

/* ── token resolution ─────────────────────────────────────────────────────── */

/**
 * Pull `--name: oklch(L C H)` declarations out of a CSS string, resolving
 * var(--brand-hue) and numeric aliases. Only the :root block is read, since
 * that is what the site renders (dark mode is not supported).
 */
export function parseTokens(css) {
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  const scope = rootMatch ? rootMatch[1] : css;

  const hueMatch = scope.match(/--brand-hue:\s*([\d.]+)/);
  const brandHue = hueMatch ? Number(hueMatch[1]) : 265;

  const tokens = {};
  const re = /--([a-z0-9-]+):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([^)]+?)\s*\)/gi;
  let m;
  while ((m = re.exec(scope))) {
    const [, name, L, C, hRaw] = m;
    /*
     * The hue capture stops at the first ")", so "var(--brand-hue)" arrives here
     * as "var(--brand-hue" with the paren already eaten. Match without it.
     */
    let h = hRaw.trim();
    if (/var\(\s*--brand-hue\s*\)?/.test(h)) h = brandHue;
    else if (/^[\d.]+$/.test(h)) h = Number(h);
    else continue; // an unresolvable hue expression is skipped rather than guessed
    tokens[name] = { L: Number(L), C: Number(C), h: Number(h), rgb: oklchToRgb(Number(L), Number(C), Number(h)) };
  }
  return { brandHue, tokens };
}

/**
 * The pairs that actually appear together in rendered UI. Body text needs 4.5,
 * large display text and UI borders need 3.
 */
export const PAIRS = [
  { fg: "foreground", bg: "background", min: 4.5, what: "body text on the page" },
  { fg: "muted-foreground", bg: "background", min: 4.5, what: "secondary text on the page" },
  { fg: "muted-foreground", bg: "muted", min: 4.5, what: "secondary text on a muted panel" },
  { fg: "card-foreground", bg: "card", min: 4.5, what: "text on a card" },
  { fg: "primary-foreground", bg: "primary", min: 4.5, what: "button label on the brand colour" },
  { fg: "secondary-foreground", bg: "secondary", min: 4.5, what: "text on a secondary surface" },
  { fg: "accent-foreground", bg: "accent", min: 4.5, what: "text on an accent surface" },
  { fg: "destructive-foreground", bg: "destructive", min: 4.5, what: "text on a destructive button" },
  { fg: "primary", bg: "background", min: 3, what: "brand colour as a link or large heading" },
  { fg: "border", bg: "background", min: 1.4, what: "border visibility" },
];

/** Returns [{ok, ratio, min, fg, bg, what, fgHex, bgHex}] for every resolvable pair. */
export function auditTokens(css) {
  const { brandHue, tokens } = parseTokens(css);
  const results = [];
  for (const p of PAIRS) {
    const fg = tokens[p.fg], bg = tokens[p.bg];
    if (!fg || !bg) continue;
    const ratio = contrast(fg.rgb, bg.rgb);
    results.push({
      ...p,
      ratio: Math.round(ratio * 100) / 100,
      ok: ratio >= p.min,
      fgHex: hex(fg.rgb),
      bgHex: hex(bg.rgb),
    });
  }
  return { brandHue, results, tokens };
}

/* ── automatic primary selection ──────────────────────────────────────────── */

/**
 * Pick a readable primary for an arbitrary scraped hue.
 *
 * A fixed lightness cannot work. At L=0.58 (the value this starter shipped with)
 * 51 of 72 hues produce a primary whose near-white label falls below 4.5:1 —
 * cyan, teal, green and yellow brands all ship unreadable buttons. Forcing
 * L=0.50 passes everywhere but drains the colour.
 *
 * So do what a designer does: keep the colour as vivid as the hue allows and
 * flip the label to near-black when the brand colour is intrinsically bright.
 * Returns the most vivid passing option, preferring a light label on a tie so
 * buttons stay bold rather than washed out.
 */
export function pickPrimary(hue, { minRatio = 4.5, chroma = 0.2 } = {}) {
  const LIGHT_FG = { L: 0.99, C: 0.01 };
  const DARK_FG = { L: 0.18, C: 0.03 };
  const candidates = [];

  for (const fg of [LIGHT_FG, DARK_FG]) {
    const fgRgb = oklchToRgb(fg.L, fg.C, hue);
    // Walk from vivid to conservative and keep the first that clears the bar.
    for (let L = 0.78; L >= 0.34; L -= 0.01) {
      const rgb = oklchToRgb(L, chroma, hue);
      const ratio = contrast(rgb, fgRgb);
      if (ratio >= minRatio) {
        candidates.push({
          L: Math.round(L * 100) / 100, C: chroma, hue,
          fgL: fg.L, fgC: fg.C,
          fgKind: fg === LIGHT_FG ? "light" : "dark",
          ratio: Math.round(ratio * 100) / 100,
          hex: hex(rgb), fgHex: hex(fgRgb),
          // How vivid the result reads: mid lightness carries the most colour.
          vividness: 1 - Math.abs(L - 0.6),
        });
        break;
      }
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.vividness - a.vividness || (a.fgKind === "light" ? -1 : 1));
  return candidates[0];
}

/** Border lightness that stays visible against the page. */
export function pickBorder(hue, { minRatio = 1.4 } = {}) {
  const bg = oklchToRgb(0.99, 0.004, hue);
  for (let L = 0.92; L >= 0.74; L -= 0.01) {
    const rgb = oklchToRgb(L, 0.01, hue);
    if (contrast(rgb, bg) >= minRatio) {
      return { L: Math.round(L * 100) / 100, C: 0.01, hue, ratio: Math.round(contrast(rgb, bg) * 100) / 100, hex: hex(rgb) };
    }
  }
  return { L: 0.86, C: 0.01, hue, ratio: null, hex: hex(oklchToRgb(0.86, 0.01, hue)) };
}
