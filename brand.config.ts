/**
 * BRAND CONFIG — the single source of truth for this site.
 *
 * Edit values here, then run `npm run brand` to propagate the build-time-only
 * surfaces (package.json name, globals.css theme, lib/fonts.ts, README title).
 * Everything else (UI text, <title>, OG tags, footer) imports this file directly.
 *
 * Colors are OKLCH. Change the hue (0-360) to re-skin the whole site:
 *   265 violet · 230 blue · 160 emerald · 25 red · 70 amber
 *
 * Copy does NOT live here. Page copy lives in content/*.ts (see content/types.ts).
 */

export const brand = {
  /** Company name. Nav, hero, footer, <title>, OG tags. `/build` sets it. */
  name: "Caribbean Fishing Academy Charters",

  /** One-line value prop. Hero sub-headline + meta description. `/build` sets it. */
  tagline: "Top fishing charter of San Juan, Puerto Rico. Inshore, offshore and reef fishing, sunset bay cruises and boat sightseeing.",

  /** Longer SEO / Open Graph description, ~150 chars. `/build` sets it. */
  description: "The top professional fishing captains and charter operation in San Juan, Puerto Rico. Fish for tarpon, snapper, mahi mahi, wahoo, tuna and blue marlin, or cruise Old San Juan Bay at sunset. Fishing with purpose: every trip supports our youth angling outreach program.",

  /** Production domain, no protocol. Only used for metadataBase + canonical URLs. */
  domain: "caribbeanfishingacademy.getyetti.com",

  /** Theme. Run `npm run brand` after editing. */
  theme: {
    /** Brand hue in OKLCH degrees (0-360). This one number re-skins the site. */
    hue: 48,
    /** Corner style. "sharp" = editorial, "rounded" = friendly, "pill" = playful. */
    corners: "rounded" as "sharp" | "rounded" | "pill",
    /** Light only. Dark mode is not supported. */
    defaultScheme: "light" as const,
  },

  /** Any Google Font name works. Run `npm run brand` after editing. */
  fonts: {
    /** Headlines. Pick a face with personality, this is what breaks the AI look. */
    display: "Bricolage Grotesque",
    /** Body / UI. Clean and readable. */
    sans: "Plus Jakarta Sans",
    /** Code / labels / eyebrows. */
    mono: "JetBrains Mono",
  },

  /** Footer links. Empty strings are skipped. */
  social: {
    instagram: "",
    facebook: "https://www.facebook.com/CFA-Caribbean-Fishing-Academy-708696695823502/",
    linkedin: "",
    x: "",
    github: "",
    email: "caribbeanfishingacademy@gmail.com",
  },

  /**
   * Contact. `npm run clone` fills these from the scraped site.
   * - whatsapp: digits only, country code first, no "+". Set it and the click-to-chat
   *   widget appears (components/widget/whatsapp-widget.tsx).
   * - address + mapQuery: set them and a map section can render a pin + embed.
   */
  contact: {
    whatsapp: "",
    phone: "+1 (787) 405-4100",
    email: "caribbeanfishingacademy@gmail.com",
    address: "Centro Pesquero, Parque Central, San Juan, PR 00907",
    mapQuery: "Caribbean Fishing Academy Charters, Centro Pesquero, Parque Central, San Juan, PR 00907",
  },
} as const;

export type Brand = typeof brand;
export default brand;
