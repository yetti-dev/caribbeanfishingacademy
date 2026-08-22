/**
 * Theme state for the section picker, plus the compact JSON wire format.
 *
 * The JSON is deliberately terse: single-letter keys and section codes only. It
 * gets pasted into chat and into the picker, so every byte is one a colleague
 * has to copy correctly.
 */
import { primaryFromHex, type Primary } from "@/lib/color";
import { ACCENT_FONTS, BODY_FONTS, DISPLAY_FONTS, fontById } from "@/lib/showcase-fonts";

export type AccentSize = "xs" | "sm" | "md";

export type Theme = {
  /** What the user typed or picked. */
  hex: string;
  displayFont: string;
  bodyFont: string;
  accentFont: string;
  accentUpper: boolean;
  accentSize: AccentSize;
};

export const DEFAULT_THEME: Theme = {
  hex: "#3b6beb",
  displayFont: "space-grotesk",
  bodyFont: "geist",
  accentFont: "jetbrains",
  accentUpper: true,
  accentSize: "xs",
};

const ACCENT_SIZES: Record<AccentSize, { size: string; tracking: string }> = {
  xs: { size: "0.6875rem", tracking: "0.22em" },
  sm: { size: "0.75rem", tracking: "0.2em" },
  md: { size: "0.875rem", tracking: "0.14em" },
};

/** Resolve a theme into the CSS variables the sections read. */
export function themeVars(t: Theme): React.CSSProperties {
  const p: Primary = primaryFromHex(t.hex) ?? primaryFromHex(DEFAULT_THEME.hex)!;
  const accent = ACCENT_SIZES[t.accentSize];
  return {
    "--brand-hue": String(p.hue),
    "--primary": `oklch(${p.L} ${p.C} ${p.hue})`,
    "--primary-foreground": `oklch(${p.fgL} ${p.fgC} ${p.hue})`,
    "--border": `oklch(${p.borderL} 0.01 ${p.hue})`,
    "--input": `oklch(${p.borderL} 0.01 ${p.hue})`,
    "--font-display": fontById(DISPLAY_FONTS, t.displayFont).stack,
    "--font-sans": fontById(BODY_FONTS, t.bodyFont).stack,
    "--accent-font": fontById(ACCENT_FONTS, t.accentFont).stack,
    "--accent-size": accent.size,
    "--accent-tracking": accent.tracking,
    "--accent-transform": t.accentUpper ? "uppercase" : "none",
    "--accent-weight": t.accentUpper ? "500" : "600",
  } as React.CSSProperties;
}

/** What the picker reports back about the resolved primary. */
export const resolvePrimary = (hex: string) => primaryFromHex(hex);

/* ── compact wire format ──────────────────────────────────────────────────── */

export type Layout = { theme: Theme; sections: string[] };

/**
 * v1 shape, single-letter keys:
 *   v version, c colour hex, d display font, b body font, a accent font,
 *   u accent uppercase (1/0), z accent size, s section codes
 */
export function encodeLayout({ theme, sections }: Layout): string {
  return JSON.stringify({
    v: 1,
    c: theme.hex,
    d: theme.displayFont,
    b: theme.bodyFont,
    a: theme.accentFont,
    u: theme.accentUpper ? 1 : 0,
    z: theme.accentSize,
    s: sections,
  });
}

export function decodeLayout(raw: string, validCodes: string[]): { layout: Layout; warnings: string[] } | { error: string } {
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(raw.trim());
  } catch {
    return { error: "That is not valid JSON. Paste the whole string including the braces." };
  }
  if (typeof o !== "object" || o === null) return { error: "Expected a JSON object." };
  if (o.v !== 1) return { error: `Unknown layout version ${String(o.v)}. This picker reads v1.` };

  const warnings: string[] = [];
  const pickId = (val: unknown, list: { id: string }[], fallback: string, label: string) => {
    if (typeof val !== "string") return fallback;
    if (list.some((f) => f.id === val)) return val;
    warnings.push(`${label} "${val}" is not one of the available fonts, kept ${fallback}.`);
    return fallback;
  };

  const hex = typeof o.c === "string" && primaryFromHex(o.c) ? o.c : DEFAULT_THEME.hex;
  if (hex !== o.c) warnings.push(`Colour "${String(o.c)}" is not a valid hex, kept ${hex}.`);

  const codes = Array.isArray(o.s) ? o.s.filter((x): x is string => typeof x === "string") : [];
  const known = codes.filter((c) => validCodes.includes(c));
  const unknown = codes.filter((c) => !validCodes.includes(c));
  if (unknown.length) warnings.push(`Skipped ${unknown.length} unknown section code(s): ${unknown.join(", ")}.`);

  const size = (["xs", "sm", "md"] as const).includes(o.z as AccentSize) ? (o.z as AccentSize) : DEFAULT_THEME.accentSize;

  return {
    layout: {
      theme: {
        hex,
        displayFont: pickId(o.d, DISPLAY_FONTS, DEFAULT_THEME.displayFont, "Display font"),
        bodyFont: pickId(o.b, BODY_FONTS, DEFAULT_THEME.bodyFont, "Body font"),
        accentFont: pickId(o.a, ACCENT_FONTS, DEFAULT_THEME.accentFont, "Accent font"),
        accentUpper: o.u !== 0,
        accentSize: size,
      },
      sections: known,
    },
    warnings,
  };
}
