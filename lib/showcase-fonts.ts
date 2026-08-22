/**
 * Font choices for the section picker.
 *
 * next/font requires STATIC calls, so every option a colleague can pick has to
 * be declared here up front. They are self-hosted at build time, which means no
 * network request at runtime and no layout shift, at the cost of a slightly
 * longer build.
 *
 * Deliberately NOT offering Inter, Roboto or Geist as a heading face: those are
 * the defaults that make a site read as generated. Geist stays as a body option
 * where it earns its place.
 */
import {
  Space_Grotesk, Fraunces, Instrument_Serif, Sora, Bricolage_Grotesque, Playfair_Display,
  Geist, DM_Sans, Work_Sans, Source_Sans_3,
  JetBrains_Mono, IBM_Plex_Mono, Space_Mono,
} from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-space-grotesk", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--f-instrument-serif", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--f-sora", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--f-playfair", display: "swap" });

const geist = Geist({ subsets: ["latin"], variable: "--f-geist", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--f-dm-sans", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--f-work-sans", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--f-source-sans", display: "swap" });

const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--f-jetbrains", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-plex-mono", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-space-mono", display: "swap" });

/** Every variable, mounted once on the showcase wrapper. */
export const showcaseFontClass = [
  spaceGrotesk, fraunces, instrumentSerif, sora, bricolage, playfair,
  geist, dmSans, workSans, sourceSans,
  jetbrains, plexMono, spaceMono,
].map((f) => f.variable).join(" ");

export type FontOption = { id: string; name: string; stack: string };

export const DISPLAY_FONTS: FontOption[] = [
  { id: "space-grotesk", name: "Space Grotesk", stack: "var(--f-space-grotesk), sans-serif" },
  { id: "fraunces", name: "Fraunces", stack: "var(--f-fraunces), serif" },
  { id: "instrument-serif", name: "Instrument Serif", stack: "var(--f-instrument-serif), serif" },
  { id: "sora", name: "Sora", stack: "var(--f-sora), sans-serif" },
  { id: "bricolage", name: "Bricolage Grotesque", stack: "var(--f-bricolage), sans-serif" },
  { id: "playfair", name: "Playfair Display", stack: "var(--f-playfair), serif" },
];

export const BODY_FONTS: FontOption[] = [
  { id: "geist", name: "Geist", stack: "var(--f-geist), sans-serif" },
  { id: "dm-sans", name: "DM Sans", stack: "var(--f-dm-sans), sans-serif" },
  { id: "work-sans", name: "Work Sans", stack: "var(--f-work-sans), sans-serif" },
  { id: "source-sans", name: "Source Sans 3", stack: "var(--f-source-sans), sans-serif" },
];

export const ACCENT_FONTS: FontOption[] = [
  { id: "jetbrains", name: "JetBrains Mono", stack: "var(--f-jetbrains), monospace" },
  { id: "plex-mono", name: "IBM Plex Mono", stack: "var(--f-plex-mono), monospace" },
  { id: "space-mono", name: "Space Mono", stack: "var(--f-space-mono), monospace" },
  { id: "inherit-body", name: "Same as body", stack: "var(--font-sans), sans-serif" },
];

export const fontById = (list: FontOption[], id: string) => list.find((f) => f.id === id) ?? list[0];
