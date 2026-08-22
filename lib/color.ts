/**
 * Client-side colour maths for the section picker.
 *
 * Mirrors scripts/lib/color.mjs, which runs in Node for `npm run brand` and the
 * guard. This copy exists because the picker converts an arbitrary hex the user
 * types into a token set in the browser, and a scripts/ module cannot be
 * imported into a client component.
 *
 * The important part is pickPrimary: a hex alone is not safe to use as
 * --primary. Measured across the wheel, a fixed lightness puts the button label
 * under 4.5:1 for most hues, so the lightness is solved per hue and the label
 * flips to near-black when the colour is intrinsically bright.
 */

export type Rgb = [number, number, number];
export type Oklch = { L: number; C: number; h: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* ── conversions ──────────────────────────────────────────────────────────── */

export function hexToRgb(hex: string): Rgb | null {
  let s = hex.trim().replace(/^#/, "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) return null;
  return [parseInt(s.slice(0, 2), 16) / 255, parseInt(s.slice(2, 4), 16) / 255, parseInt(s.slice(4, 6), 16) / 255];
}

export const rgbToHex = ([r, g, b]: Rgb) =>
  "#" + [r, g, b].map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, "0")).join("");

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

/** sRGB -> OKLCH (Björn Ottosson's matrices). */
export function rgbToOklch([r, g, b]: Rgb): Oklch {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

/** OKLCH -> sRGB. */
export function oklchToRgb(L: number, C: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [clamp01(toGamma(clamp01(r))), clamp01(toGamma(clamp01(g))), clamp01(toGamma(clamp01(bb)))];
}

/* ── contrast ─────────────────────────────────────────────────────────────── */

export const luminance = ([r, g, b]: Rgb) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

export function contrast(a: Rgb, b: Rgb) {
  const la = luminance(a), lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* ── safe primary ─────────────────────────────────────────────────────────── */

export type Primary = {
  hue: number; L: number; C: number;
  fgL: number; fgC: number; fgKind: "light" | "dark";
  ratio: number; hex: string; borderL: number;
};

/**
 * Turn any hue into a usable --primary. Walks from vivid to conservative and
 * keeps the first lightness that clears the bar, trying a near-white label and
 * a near-black one, then prefers whichever result carries the most colour.
 */
export function pickPrimary(hue: number, chroma = 0.2, minRatio = 4.5): Primary {
  const options: Primary[] = [];
  for (const fg of [{ L: 0.99, C: 0.01, kind: "light" as const }, { L: 0.18, C: 0.03, kind: "dark" as const }]) {
    const fgRgb = oklchToRgb(fg.L, fg.C, hue);
    for (let L = 0.78; L >= 0.34; L -= 0.01) {
      const rgb = oklchToRgb(L, chroma, hue);
      const ratio = contrast(rgb, fgRgb);
      if (ratio >= minRatio) {
        options.push({
          hue, L: Math.round(L * 100) / 100, C: chroma,
          fgL: fg.L, fgC: fg.C, fgKind: fg.kind,
          ratio: Math.round(ratio * 100) / 100, hex: rgbToHex(rgb),
          borderL: pickBorderL(hue),
        });
        break;
      }
    }
  }
  if (!options.length) {
    // Should be unreachable: L=0.34 clears 4.5:1 at every hue.
    return { hue, L: 0.45, C: chroma, fgL: 0.99, fgC: 0.01, fgKind: "light", ratio: 0, hex: rgbToHex(oklchToRgb(0.45, chroma, hue)), borderL: 0.87 };
  }
  options.sort((a, b) => Math.abs(a.L - 0.6) - Math.abs(b.L - 0.6) || (a.fgKind === "light" ? -1 : 1));
  return options[0];
}

function pickBorderL(hue: number, minRatio = 1.4) {
  const bg = oklchToRgb(0.99, 0.004, hue);
  for (let L = 0.92; L >= 0.74; L -= 0.01) {
    if (contrast(oklchToRgb(L, 0.01, hue), bg) >= minRatio) return Math.round(L * 100) / 100;
  }
  return 0.86;
}

/** Everything the picker needs from a single hex the user typed. */
export function primaryFromHex(hex: string): Primary | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const { h, C } = rgbToOklch(rgb);
  // Keep some of the input's own saturation, but never so little it reads grey.
  const chroma = Math.min(0.28, Math.max(0.09, C));
  return pickPrimary(Math.round(h), Math.round(chroma * 100) / 100);
}
