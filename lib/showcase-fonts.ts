/**
 * Font choices for the section picker. GENERATED, do not hand-edit.
 *
 * next/font requires STATIC, literal calls: it reads the arguments at build time
 * to fetch and self-host each family, and a shared options object spread into
 * every call fails with "Unexpected spread". So every call is written out.
 *
 * Families are declared once and reused across lists. A good sans works as both
 * a heading and a body face, and a label set in a sans or a serif is often
 * better than defaulting everything to mono.
 *
 * Inter is offered for BODY only. As a heading face it is the biggest single
 * tell that a page was generated rather than designed.
 */
import {
  Anonymous_Pro,
  Archivo,
  Asap,
  Assistant,
  Azeret_Mono,
  Barlow,
  Be_Vietnam_Pro,
  Bitter,
  Bricolage_Grotesque,
  Cabin,
  Cormorant_Garamond,
  Crimson_Pro,
  DM_Mono,
  DM_Sans,
  DM_Serif_Display,
  Epilogue,
  Figtree,
  Fira_Code,
  Fraunces,
  Geist,
  Geist_Mono,
  Heebo,
  IBM_Plex_Mono,
  Inconsolata,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Karla,
  Lato,
  Libre_Baskerville,
  Lora,
  Manrope,
  Mulish,
  Newsreader,
  Noto_Sans_Mono,
  Nunito_Sans,
  Open_Sans,
  Outfit,
  Overpass_Mono,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Public_Sans,
  Red_Hat_Mono,
  Roboto_Mono,
  Rubik,
  Sometype_Mono,
  Sora,
  Source_Sans_3,
  Space_Grotesk,
  Space_Mono,
  Spectral,
  Spline_Sans_Mono,
  Syne,
  Urbanist,
  Work_Sans,
} from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-space-grotesk", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-bricolage", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--f-syne", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--f-sora", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--f-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--f-jakarta", display: "swap" });
const epilogue = Epilogue({ subsets: ["latin"], variable: "--f-epilogue", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--f-archivo", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree", display: "swap" });
const urbanist = Urbanist({ subsets: ["latin"], variable: "--f-urbanist", display: "swap" });
const beVietnam = Be_Vietnam_Pro({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--f-be-vietnam", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-fraunces", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--f-instrument-serif", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--f-playfair", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--f-dm-serif", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--f-lora", display: "swap" });
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-libre-baskerville", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--f-cormorant", display: "swap" });
const spectral = Spectral({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--f-spectral", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--f-newsreader", display: "swap" });
const crimsonPro = Crimson_Pro({ subsets: ["latin"], variable: "--f-crimson-pro", display: "swap" });
const bitter = Bitter({ subsets: ["latin"], variable: "--f-bitter", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--f-geist", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--f-dm-sans", display: "swap" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--f-work-sans", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--f-source-sans", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--f-nunito-sans", display: "swap" });
const rubik = Rubik({ subsets: ["latin"], variable: "--f-rubik", display: "swap" });
const karla = Karla({ subsets: ["latin"], variable: "--f-karla", display: "swap" });
const mulish = Mulish({ subsets: ["latin"], variable: "--f-mulish", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--f-public-sans", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-lato", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--f-open-sans", display: "swap" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument-sans", display: "swap" });
const cabin = Cabin({ subsets: ["latin"], variable: "--f-cabin", display: "swap" });
const asap = Asap({ subsets: ["latin"], variable: "--f-asap", display: "swap" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-barlow", display: "swap" });
const assistant = Assistant({ subsets: ["latin"], variable: "--f-assistant", display: "swap" });
const heebo = Heebo({ subsets: ["latin"], variable: "--f-heebo", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--f-jetbrains", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-plex-mono", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-space-mono", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--f-geist-mono", display: "swap" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--f-roboto-mono", display: "swap" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--f-fira-code", display: "swap" });
const azeretMono = Azeret_Mono({ subsets: ["latin"], variable: "--f-azeret-mono", display: "swap" });
const overpassMono = Overpass_Mono({ subsets: ["latin"], variable: "--f-overpass-mono", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-dm-mono", display: "swap" });
const inconsolata = Inconsolata({ subsets: ["latin"], variable: "--f-inconsolata", display: "swap" });
const sometypeMono = Sometype_Mono({ subsets: ["latin"], variable: "--f-sometype-mono", display: "swap" });
const splineMono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--f-spline-mono", display: "swap" });
const redhatMono = Red_Hat_Mono({ subsets: ["latin"], variable: "--f-redhat-mono", display: "swap" });
const notoMono = Noto_Sans_Mono({ subsets: ["latin"], variable: "--f-noto-mono", display: "swap" });
const anonymousPro = Anonymous_Pro({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-anonymous-pro", display: "swap" });

/** Every variable, mounted once so previews and sections both resolve them. */
export const showcaseFontClass = [
  spaceGrotesk, bricolage, syne, sora, outfit, manrope,
  jakarta, epilogue, archivo, figtree, urbanist, beVietnam,
  fraunces, instrumentSerif, playfair, dmSerif, lora, libreBaskerville,
  cormorant, spectral, newsreader, crimsonPro, bitter, geist,
  dmSans, workSans, sourceSans, inter, nunitoSans, rubik,
  karla, mulish, publicSans, lato, openSans, instrumentSans,
  cabin, asap, barlow, assistant, heebo, jetbrains,
  plexMono, spaceMono, geistMono, robotoMono, firaCode, azeretMono,
  overpassMono, dmMono, inconsolata, sometypeMono, splineMono, redhatMono,
  notoMono, anonymousPro,
].map((f) => f.variable).join(" ");

export type FontOption = { id: string; name: string; stack: string; note?: string };

export const DISPLAY_FONTS: FontOption[] = [
  { id: "space-grotesk", name: "Space Grotesk", stack: "var(--f-space-grotesk), sans-serif", note: "Geometric" },
  { id: "bricolage", name: "Bricolage Grotesque", stack: "var(--f-bricolage), sans-serif", note: "Quirky" },
  { id: "syne", name: "Syne", stack: "var(--f-syne), sans-serif", note: "Editorial" },
  { id: "sora", name: "Sora", stack: "var(--f-sora), sans-serif", note: "Technical" },
  { id: "outfit", name: "Outfit", stack: "var(--f-outfit), sans-serif", note: "Clean" },
  { id: "manrope", name: "Manrope", stack: "var(--f-manrope), sans-serif", note: "Friendly" },
  { id: "jakarta", name: "Plus Jakarta Sans", stack: "var(--f-jakarta), sans-serif", note: "Modern" },
  { id: "epilogue", name: "Epilogue", stack: "var(--f-epilogue), sans-serif", note: "Sharp" },
  { id: "archivo", name: "Archivo", stack: "var(--f-archivo), sans-serif", note: "Grotesque" },
  { id: "figtree", name: "Figtree", stack: "var(--f-figtree), sans-serif", note: "Warm" },
  { id: "urbanist", name: "Urbanist", stack: "var(--f-urbanist), sans-serif", note: "Rounded" },
  { id: "be-vietnam", name: "Be Vietnam Pro", stack: "var(--f-be-vietnam), sans-serif", note: "Confident" },
  { id: "fraunces", name: "Fraunces", stack: "var(--f-fraunces), serif", note: "Soft serif" },
  { id: "instrument-serif", name: "Instrument Serif", stack: "var(--f-instrument-serif), serif", note: "High contrast" },
  { id: "playfair", name: "Playfair Display", stack: "var(--f-playfair), serif", note: "Classic" },
  { id: "dm-serif", name: "DM Serif Display", stack: "var(--f-dm-serif), serif", note: "Elegant" },
  { id: "lora", name: "Lora", stack: "var(--f-lora), serif", note: "Readable serif" },
  { id: "libre-baskerville", name: "Libre Baskerville", stack: "var(--f-libre-baskerville), serif", note: "Traditional" },
  { id: "cormorant", name: "Cormorant Garamond", stack: "var(--f-cormorant), serif", note: "Delicate" },
  { id: "spectral", name: "Spectral", stack: "var(--f-spectral), serif", note: "Literary" },
  { id: "newsreader", name: "Newsreader", stack: "var(--f-newsreader), serif", note: "Newsy" },
  { id: "crimson-pro", name: "Crimson Pro", stack: "var(--f-crimson-pro), serif", note: "Bookish" },
  { id: "bitter", name: "Bitter", stack: "var(--f-bitter), serif", note: "Slab" },
];

export const BODY_FONTS: FontOption[] = [
  { id: "geist", name: "Geist", stack: "var(--f-geist), sans-serif", note: "Neutral" },
  { id: "dm-sans", name: "DM Sans", stack: "var(--f-dm-sans), sans-serif", note: "Geometric" },
  { id: "work-sans", name: "Work Sans", stack: "var(--f-work-sans), sans-serif", note: "Sturdy" },
  { id: "source-sans", name: "Source Sans 3", stack: "var(--f-source-sans), sans-serif", note: "Humanist" },
  { id: "inter", name: "Inter", stack: "var(--f-inter), sans-serif", note: "Neutral" },
  { id: "nunito-sans", name: "Nunito Sans", stack: "var(--f-nunito-sans), sans-serif", note: "Soft" },
  { id: "rubik", name: "Rubik", stack: "var(--f-rubik), sans-serif", note: "Rounded" },
  { id: "karla", name: "Karla", stack: "var(--f-karla), sans-serif", note: "Grotesque" },
  { id: "mulish", name: "Mulish", stack: "var(--f-mulish), sans-serif", note: "Clean" },
  { id: "public-sans", name: "Public Sans", stack: "var(--f-public-sans), sans-serif", note: "Plain" },
  { id: "lato", name: "Lato", stack: "var(--f-lato), sans-serif", note: "Warm" },
  { id: "open-sans", name: "Open Sans", stack: "var(--f-open-sans), sans-serif", note: "Familiar" },
  { id: "instrument-sans", name: "Instrument Sans", stack: "var(--f-instrument-sans), sans-serif", note: "Compact" },
  { id: "cabin", name: "Cabin", stack: "var(--f-cabin), sans-serif", note: "Friendly" },
  { id: "asap", name: "Asap", stack: "var(--f-asap), sans-serif", note: "Condensed" },
  { id: "barlow", name: "Barlow", stack: "var(--f-barlow), sans-serif", note: "Industrial" },
  { id: "assistant", name: "Assistant", stack: "var(--f-assistant), sans-serif", note: "Light" },
  { id: "heebo", name: "Heebo", stack: "var(--f-heebo), sans-serif", note: "Even" },
  { id: "figtree", name: "Figtree", stack: "var(--f-figtree), sans-serif", note: "Warm" },
  { id: "manrope", name: "Manrope", stack: "var(--f-manrope), sans-serif", note: "Friendly" },
  { id: "outfit", name: "Outfit", stack: "var(--f-outfit), sans-serif", note: "Clean" },
  { id: "jakarta", name: "Plus Jakarta Sans", stack: "var(--f-jakarta), sans-serif", note: "Modern" },
  { id: "urbanist", name: "Urbanist", stack: "var(--f-urbanist), sans-serif", note: "Rounded" },
  { id: "archivo", name: "Archivo", stack: "var(--f-archivo), sans-serif", note: "Grotesque" },
  { id: "sora", name: "Sora", stack: "var(--f-sora), sans-serif", note: "Technical" },
  { id: "epilogue", name: "Epilogue", stack: "var(--f-epilogue), sans-serif", note: "Sharp" },
  { id: "be-vietnam", name: "Be Vietnam Pro", stack: "var(--f-be-vietnam), sans-serif", note: "Confident" },
  { id: "space-grotesk", name: "Space Grotesk", stack: "var(--f-space-grotesk), sans-serif", note: "Geometric" },
];

export const ACCENT_FONTS: FontOption[] = [
  { id: "jetbrains", name: "JetBrains Mono", stack: "var(--f-jetbrains), monospace", note: "Technical" },
  { id: "plex-mono", name: "IBM Plex Mono", stack: "var(--f-plex-mono), monospace", note: "Editorial" },
  { id: "space-mono", name: "Space Mono", stack: "var(--f-space-mono), monospace", note: "Retro" },
  { id: "geist-mono", name: "Geist Mono", stack: "var(--f-geist-mono), monospace", note: "Neutral" },
  { id: "roboto-mono", name: "Roboto Mono", stack: "var(--f-roboto-mono), monospace", note: "Plain" },
  { id: "fira-code", name: "Fira Code", stack: "var(--f-fira-code), monospace", note: "Precise" },
  { id: "azeret-mono", name: "Azeret Mono", stack: "var(--f-azeret-mono), monospace", note: "Bold" },
  { id: "overpass-mono", name: "Overpass Mono", stack: "var(--f-overpass-mono), monospace", note: "Open" },
  { id: "dm-mono", name: "DM Mono", stack: "var(--f-dm-mono), monospace", note: "Quiet" },
  { id: "inconsolata", name: "Inconsolata", stack: "var(--f-inconsolata), monospace", note: "Narrow" },
  { id: "sometype-mono", name: "Sometype Mono", stack: "var(--f-sometype-mono), monospace", note: "Warm" },
  { id: "spline-mono", name: "Spline Sans Mono", stack: "var(--f-spline-mono), monospace", note: "Soft" },
  { id: "redhat-mono", name: "Red Hat Mono", stack: "var(--f-redhat-mono), monospace", note: "Clean" },
  { id: "noto-mono", name: "Noto Sans Mono", stack: "var(--f-noto-mono), monospace", note: "Even" },
  { id: "anonymous-pro", name: "Anonymous Pro", stack: "var(--f-anonymous-pro), monospace", note: "Typewriter" },
  { id: "space-grotesk", name: "Space Grotesk", stack: "var(--f-space-grotesk), sans-serif", note: "Geometric" },
  { id: "syne", name: "Syne", stack: "var(--f-syne), sans-serif", note: "Editorial" },
  { id: "archivo", name: "Archivo", stack: "var(--f-archivo), sans-serif", note: "Grotesque" },
  { id: "fraunces", name: "Fraunces", stack: "var(--f-fraunces), sans-serif", note: "Soft serif" },
  { id: "instrument-serif", name: "Instrument Serif", stack: "var(--f-instrument-serif), sans-serif", note: "High contrast" },
  { id: "inherit-body", name: "Same as body", stack: "var(--font-sans), sans-serif", note: "Match body" },
];

export const fontById = (list: FontOption[], id: string) => list.find((f) => f.id === id) ?? list[0];
