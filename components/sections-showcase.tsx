"use client";

/**
 * The section catalogue.
 *
 * Two things here are deliberate:
 *
 * 1. STACKING. Several sections contain their own sticky navbar at z-50. The
 *    catalogue's own chrome has to sit above all of them, so every section is
 *    wrapped in a element with `isolate`, which opens a new stacking context.
 *    A child's z-50 is then scoped to its own frame and can never paint over
 *    the catalogue bar. Without this the demo navbars fight the page header.
 *
 * 2. LIVE THEME. The whole token system derives from --brand-hue, so setting
 *    that one variable on a wrapper re-skins every section below it. Hue alone
 *    is not enough though: at a fixed lightness the button label falls under
 *    4.5:1 for most hues, so each swatch also carries a solved --primary
 *    lightness. Those values come from scripts/lib/color.mjs and every one was
 *    verified at 4.5:1 or better.
 */

import { useMemo, useState } from "react";
import { Check, Palette, PanelsTopLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Nav01 } from "@/components/sections/nav/nav-01";
import { Nav02 } from "@/components/sections/nav/nav-02";
import { Nav03 } from "@/components/sections/nav/nav-03";
import { Nav04 } from "@/components/sections/nav/nav-04";
import { Nav05 } from "@/components/sections/nav/nav-05";
import { Hero01 } from "@/components/sections/hero/hero-01";
import { Hero02 } from "@/components/sections/hero/hero-02";
import { Hero03 } from "@/components/sections/hero/hero-03";
import { Hero04 } from "@/components/sections/hero/hero-04";
import { Hero05 } from "@/components/sections/hero/hero-05";
import { Hero06 } from "@/components/sections/hero/hero-06";
import { Hero07 } from "@/components/sections/hero/hero-07";
import { Hero08 } from "@/components/sections/hero/hero-08";
import { Hero09 } from "@/components/sections/hero/hero-09";
import { Hero10 } from "@/components/sections/hero/hero-10";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Feature02 } from "@/components/sections/features/feature-02";
import { Feature03 } from "@/components/sections/features/feature-03";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature05 } from "@/components/sections/features/feature-05";
import { demoCta, demoCtaAlt, demoFeatures, demoNav, demoStats, img } from "@/content/demo";

/* ── theme swatches ───────────────────────────────────────────────────────── */

type Swatch = { name: string; hue: number; primaryL: number; fgL: number; borderL: number; hex: string };

/** Solved by scripts/lib/color.mjs. Every entry measured at >= 4.5:1. */
const SWATCHES: Swatch[] = [
  { name: "Violet", hue: 265, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#3b6beb" },
  { name: "Ocean", hue: 232, primaryL: 0.53, fgL: 0.99, borderL: 0.87, hex: "#0078c9" },
  { name: "Teal", hue: 195, primaryL: 0.5, fgL: 0.99, borderL: 0.87, hex: "#008186" },
  { name: "Emerald", hue: 160, primaryL: 0.51, fgL: 0.99, borderL: 0.87, hex: "#008539" },
  { name: "Lime", hue: 128, primaryL: 0.54, fgL: 0.99, borderL: 0.87, hex: "#4b8100" },
  { name: "Amber", hue: 75, primaryL: 0.56, fgL: 0.99, borderL: 0.87, hex: "#b55900" },
  { name: "Orange", hue: 45, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#d03e00" },
  { name: "Crimson", hue: 22, primaryL: 0.58, fgL: 0.99, borderL: 0.87, hex: "#d73240" },
  { name: "Magenta", hue: 340, primaryL: 0.58, fgL: 0.99, borderL: 0.87, hex: "#c13b9f" },
  { name: "Indigo", hue: 285, primaryL: 0.57, fgL: 0.99, borderL: 0.87, hex: "#715ce6" },
];

/* ── catalogue entries ────────────────────────────────────────────────────── */

const withImages = demoFeatures.map((f, i) => ({ ...f, image: img(20 + i, f.title) }));

type Entry = { id: string; kind: string; label: string; node: React.ReactNode };

const ENTRIES: Entry[] = [
  { id: "nav-01", kind: "Navbar", label: "Floating pill, shrinks on scroll", node: <Nav01 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { id: "nav-02", kind: "Navbar", label: "Split with utility bar and phone", node: <Nav02 brand="Marlin Charters" items={demoNav} cta={demoCta} phone="+297 592 1140" /> },
  { id: "nav-03", kind: "Navbar", label: "Editorial, centred wordmark", node: <Nav03 brand="Marlin" items={demoNav} cta={demoCta} /> },
  { id: "nav-04", kind: "Navbar", label: "Mega menu with tour panel", node: <Nav04 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { id: "nav-05", kind: "Navbar", label: "Dark bar, high contrast", node: <Nav05 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },

  { id: "hero-01", kind: "Hero", label: "Split with stat strip", node: (
    <Hero01 eyebrow="Small group sailing" title="Twelve guests, one reef, no queue for the ladder"
      body="Half and full day trips from Slip 14. Local captains, lunch cooked aboard, gear that actually fits."
      image={img(0, "Sailboat moored in clear water")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" /> ) },
  { id: "hero-02", kind: "Hero", label: "Photo above, copy on a solid card", node: (
    <Hero02 eyebrow="Since 2013" title="The reef is twenty minutes out. We know the calm side."
      body="Twelve seasons of logbooks decide where we anchor, not a brochure."
      image={img(31, "Open sea from a boat bow")} ctas={[demoCta, demoCtaAlt]} /> ) },
  { id: "hero-03", kind: "Hero", label: "Colour block, type only", node: (
    <Hero03 eyebrow="Daily departures" title="Book the boat, not a seat on it."
      body="Private charters for up to twelve, your route and your playlist. The crew handles the rest."
      ctas={[demoCta, demoCtaAlt]} footnote="Free rebooking if the captain calls it off for weather." /> ) },
  { id: "hero-04", kind: "Hero", label: "Editorial with photo strip", node: (
    <Hero04 eyebrow="Marlin Charters" title="Sail the leeward coast the way the crew would on a day off"
      body="Three snorkel stops, a beach landing, and lunch off the back deck."
      images={[img(1, "Catamaran at anchor"), img(2, "Snorkeller over coral"), img(3, "Beach seen from the water")]}
      ctas={[demoCta]} meta={["Slip 14", "12 guests max", "Est. 2013"]} /> ) },
  { id: "hero-05", kind: "Hero", label: "Mosaic bento photos", node: (
    <Hero05 eyebrow="Half day from $68" title="Two reef stops before lunch"
      body="Out at nine, back by one. Gear supplied, shade on deck, and a galley that feeds everyone."
      images={[img(4, "Boat deck at sea"), img(5, "Turquoise shallows"), img(6, "Crew trimming a sail"), img(7, "Reef fish underwater")]}
      ctas={[demoCta, demoCtaAlt]} location="Slip 14, Oranjestad Marina" /> ) },
  { id: "hero-06", kind: "Hero", label: "Centred copy, scrolling photo band", node: (
    <Hero06 eyebrow="This season" title="Every trip ends with the sun on the water"
      body="Sunset cruise, snorkel and sail, or the full day coast run."
      images={[img(8, "Sunset over the sea"), img(9, "Sail against the sky"), img(10, "Guests swimming"), img(11, "Boat wake at dusk"), img(12, "Anchored at golden hour"), img(13, "Coastline from the water")]}
      ctas={[demoCta]} /> ) },
  { id: "hero-07", kind: "Hero", label: "Dark with inline booking form", node: (
    <Hero07 eyebrow="Live availability" title="Pick a date. We will tell you what is open."
      body="No card needed to hold a spot, and the captain confirms the weather by 7am."
      image={img(14, "Boat ready at the dock")}
      tours={["Sunset cruise with dinner", "Snorkel and sail half day", "Full day coast run", "Private charter"]} /> ) },
  { id: "hero-08", kind: "Hero", label: "Asymmetric with price card", node: (
    <Hero08 eyebrow="Most booked" title="Sunset cruise with dinner aboard"
      body="Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange."
      image={img(15, "Sailboat silhouetted at sunset")} price="$88" period="per guest" duration="3 hours, evening" rating="4.9" ctas={[demoCta, demoCtaAlt]} /> ) },
  { id: "hero-09", kind: "Hero", label: "Overlapping photo frames", node: (
    <Hero09 eyebrow="Private charter" title="The whole boat, and a crew who plan around you"
      body="Twelve guests, catering to order, and a route you choose on the morning."
      images={[img(16, "Catamaran under sail"), img(17, "Table set on deck")]} ctas={[demoCta, demoCtaAlt]}
      highlights={["Up to twelve guests", "Catering and bar to order", "Departure time is yours", "Skipper and mate included"]} /> ) },
  { id: "hero-10", kind: "Hero", label: "Video dialog", node: (
    <Hero10 eyebrow="Watch first" title="Ninety seconds aboard the Marlin II"
      body="Shot on an ordinary Tuesday in March, no drone operator and no actors."
      image={img(18, "Catamaran deck under way")} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      ctas={[demoCta, demoCtaAlt]} caption="Filmed on the full day coast run" /> ) },

  { id: "feature-01", kind: "Features", label: "Three-up icon grid", node: (
    <Feature01 heading={{ eyebrow: "Why us", title: "What twelve seasons taught us", body: "Small boats, local crews, and no upselling on the water." }} features={demoFeatures} /> ) },
  { id: "feature-02", kind: "Features", label: "Bento with featured photo cell", node: (
    <Feature02 heading={{ eyebrow: "Aboard", title: "What is included, and what is not" }} features={withImages} /> ) },
  { id: "feature-03", kind: "Features", label: "Alternating image and text rows", node: (
    <Feature03 heading={{ eyebrow: "How a day runs", title: "From the dock to the last swim stop" }}
      rows={[
        { title: "Board at Slip 14", body: "Arrive fifteen minutes early. Parking is free and the crew stows your bag in the dry locker.", image: img(19, "Guests boarding at the dock"), bullets: ["Free marina parking", "Dry storage aboard", "Safety briefing before we leave"] },
        { title: "First reef stop", body: "Twenty minutes out to the leeward reef, where the water stays calm when the trades pick up.", image: img(20, "Snorkellers in calm water"), bullets: ["Masks and fins in every size", "Crew in the water with you", "Mooring buoy, never an anchor"] },
        { title: "Lunch on the back deck", body: "Grilled catch, fruit, and cold drinks while the boat swings on the mooring.", image: img(21, "Food served on a boat deck"), bullets: ["Vegetarian and vegan plates", "Allergies handled at booking", "Beer and wine after the last swim"] },
      ]} /> ) },
  { id: "feature-04", kind: "Features", label: "Numbered list on a dark panel", node: (
    <Feature04 heading={{ eyebrow: "Included", title: "Everything in the price", body: "No fuel surcharge, no gear rental, no tipping expected." }} features={demoFeatures} /> ) },
  { id: "feature-05", kind: "Features", label: "Tabbed with swapping photo", node: (
    <Feature05 heading={{ eyebrow: "Choose a trip", title: "Four ways to spend a day on the water" }} features={withImages} /> ) },
];

/* ── frame ────────────────────────────────────────────────────────────────── */

function Frame({ entry, index, total }: { entry: Entry; index: number; total: number }) {
  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-[1400px]">
        {/* Dotted rail above, carrying the label. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t-2 border-dotted border-zinc-300 pt-3">
          <span className="rounded-md bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            {entry.kind}
          </span>
          <h2 className="font-display text-sm font-semibold tracking-tight text-zinc-700">{entry.label}</h2>
          <span className="ml-auto font-mono text-[10px] text-zinc-400">
            {entry.id} · {index + 1}/{total}
          </span>
        </div>

        {/*
          isolate opens a new stacking context, so a sticky navbar at z-50 inside
          this section cannot paint over the catalogue's own bar.
        */}
        <div id={entry.id} className="isolate relative z-0 mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-background shadow-sm scroll-mt-24">
          {entry.node}
        </div>

        <div className="mt-4 border-b-2 border-dotted border-zinc-300" />
      </div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export function SectionsShowcase() {
  const [swatch, setSwatch] = useState<Swatch>(SWATCHES[0]);
  const [openNav, setOpenNav] = useState(false);

  const groups = useMemo(() => {
    const out = new Map<string, Entry[]>();
    for (const e of ENTRIES) {
      if (!out.has(e.kind)) out.set(e.kind, []);
      out.get(e.kind)!.push(e);
    }
    return [...out.entries()];
  }, []);

  /** One variable drives the whole token system; primary lightness rides along. */
  const themeVars = {
    "--brand-hue": String(swatch.hue),
    "--primary": `oklch(${swatch.primaryL} 0.2 ${swatch.hue})`,
    "--primary-foreground": `oklch(${swatch.fgL} 0.01 ${swatch.hue})`,
    "--border": `oklch(${swatch.borderL} 0.01 ${swatch.hue})`,
    "--input": `oklch(${swatch.borderL} 0.01 ${swatch.hue})`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Catalogue chrome. z-90 keeps it above every isolated section frame. */}
      <header className="sticky top-0 z-90 border-b border-zinc-300 bg-zinc-50/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-3 px-6 py-3">
          <div className="flex items-center gap-2">
            <PanelsTopLeft aria-hidden className="size-5 text-zinc-500" />
            <span className="font-display text-base font-bold tracking-tight text-zinc-800">Section library</span>
            <span className="font-mono text-xs text-zinc-500">{ENTRIES.length}</span>
          </div>

          <nav aria-label="Jump to section" className="hidden items-center gap-1 lg:flex">
            {groups.map(([kind, items]) => (
              <div key={kind} className="group relative">
                <button type="button" className="cursor-pointer rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                  {kind} <span className="text-zinc-400">{items.length}</span>
                </button>
                <div className="invisible absolute left-0 top-full z-100 w-72 translate-y-1 rounded-xl border border-zinc-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {items.map((it) => (
                    <a key={it.id} href={`#${it.id}`} className="block cursor-pointer rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                      <span className="font-mono text-[10px] text-zinc-400">{it.id}</span>
                      <span className="mt-0.5 block">{it.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <Palette aria-hidden className="size-4 text-zinc-500" />
            <div role="radiogroup" aria-label="Primary colour" className="flex flex-wrap gap-1.5">
              {SWATCHES.map((s) => (
                <button
                  key={s.name} type="button" role="radio" aria-checked={s.name === swatch.name}
                  onClick={() => setSwatch(s)} title={`${s.name} (hue ${s.hue})`}
                  style={{ backgroundColor: s.hex }}
                  className={cn(
                    "grid size-6 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:outline-none",
                    s.name === swatch.name ? "ring-2 ring-zinc-800 ring-offset-2" : "",
                  )}
                >
                  {s.name === swatch.name ? <Check aria-hidden className="size-3.5 text-white" /> : null}
                  <span className="sr-only">{s.name}</span>
                </button>
              ))}
            </div>
            <span className="hidden font-mono text-[11px] text-zinc-500 sm:inline">{swatch.name}</span>

            <button type="button" onClick={() => setOpenNav((v) => !v)} aria-label="Jump to section" aria-expanded={openNav} className="cursor-pointer rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none lg:hidden">
              {openNav ? <X aria-hidden className="size-5" /> : <PanelsTopLeft aria-hidden className="size-5" />}
            </button>
          </div>
        </div>

        {openNav ? (
          <div className="max-h-[60vh] overflow-y-auto border-t border-zinc-200 bg-white px-6 py-3 lg:hidden">
            {ENTRIES.map((it) => (
              <a key={it.id} href={`#${it.id}`} onClick={() => setOpenNav(false)} className="block cursor-pointer rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                <span className="font-mono text-[10px] text-zinc-400">{it.kind}</span> {it.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-[1400px] px-6 pb-2 pt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">Page sections</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Every section is content-prop driven, so copy stays in content files. Pick a primary colour above
          and the whole catalogue re-skins from one OKLCH hue. All ten options were checked at 4.5:1 or
          better for button labels.
        </p>
      </div>

      {/* Theme scope: the token overrides apply to every section below. */}
      <div style={themeVars}>
        {ENTRIES.map((entry, i) => (
          <Frame key={entry.id} entry={entry} index={i} total={ENTRIES.length} />
        ))}
      </div>
    </div>
  );
}
