"use client";

import * as React from "react";
import {
  Anchor,
  Fish,
  Heart,
  Map,
  Moon,
  Sailboat,
  Ship,
  Star,
  Sun,
  Sunrise,
  Users,
  WavesHorizontal as Waves,
  X,
} from "lucide-react";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { demoTours, img } from "@/content/demo";
import type { Img } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * PAGE-LISTING-GRID
 *
 * The index counterpart to PAGE-TOUR-DETAIL. A scrolling category rail, a
 * dense four up grid of rounded photo cards with save hearts and inline
 * ratings, and a map toggle that splits the page into list plus map. Small
 * type, hairline separation, mostly white. Client because the rail, the
 * hearts and the toggle all hold state.
 */

export type Listing = {
  title: string;
  area: string;
  meta: string;
  dates: string;
  price: string;
  rating: number;
  category: string;
  image: Img;
};

const categoryIcons = {
  Sailboat,
  Waves,
  Sunrise,
  Moon,
  Fish,
  Ship,
  Users,
  Anchor,
  Sun,
} as const;

export type RailItem = { label: string; icon: keyof typeof categoryIcons };

const defaultRail: RailItem[] = [
  { label: "All trips", icon: "Sailboat" },
  { label: "Reef stops", icon: "Waves" },
  { label: "Sunrise", icon: "Sunrise" },
  { label: "Sunset", icon: "Moon" },
  { label: "Fishing", icon: "Fish" },
  { label: "Catamarans", icon: "Ship" },
  { label: "Private", icon: "Users" },
  { label: "Half day", icon: "Anchor" },
  { label: "Full day", icon: "Sun" },
];

const areas = [
  "Oranjestad, Aruba",
  "Malmok reef, Aruba",
  "Arashi bay, Aruba",
  "Palm Beach, Aruba",
  "Spanish Lagoon, Aruba",
  "Baby Beach, Aruba",
];

const categories = [
  "Sunset",
  "Reef stops",
  "Full day",
  "Private",
  "Sunrise",
  "Half day",
  "Catamarans",
  "Fishing",
];

/** Twelve cards from six tours, so the grid reads as a real index. */
const defaultListings: Listing[] = Array.from({ length: 12 }, (_, i) => {
  const t = demoTours[i % demoTours.length];
  const second = i >= demoTours.length;
  return {
    title: second ? `${t.title}, small group` : t.title,
    area: areas[i % areas.length],
    meta: second ? `${t.duration}, two crew` : `${t.duration}, ${t.tags[0].toLowerCase()}`,
    dates: second ? "12 to 19 Jul" : "3 to 10 Jul",
    price: t.price,
    rating: Number((t.rating - (second ? 0.1 : 0)).toFixed(1)),
    category: categories[i % categories.length],
    image: img(second ? i + 14 : i + 1, t.image.alt),
  };
});

function ListingCard({
  listing,
  saved,
  onSave,
  compact,
}: {
  listing: Listing;
  saved: boolean;
  onSave: () => void;
  compact?: boolean;
}) {
  return (
    <article className="group">
      <div className="relative">
        <a
          href="#detail"
          className="block cursor-pointer overflow-hidden rounded-xl bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <div className={cn(compact ? "aspect-[4/3]" : "aspect-square")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={listing.image.src}
              alt={listing.image.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </div>
        </a>
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
          Guest favourite
        </span>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
          onClick={onSave}
          className="absolute top-2.5 right-2.5 grid size-8 cursor-pointer place-items-center rounded-full transition duration-200 ease-out hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Heart
            aria-hidden
            className={cn(
              "size-5 drop-shadow",
              saved ? "fill-primary text-primary" : "fill-foreground/30 text-background",
            )}
          />
        </button>
      </div>
      <div className="pt-2.5">
        <p className="flex items-baseline gap-2">
          <a
            href="#detail"
            className="min-w-0 flex-1 cursor-pointer truncate text-sm font-semibold text-foreground underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {listing.area}
          </a>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-foreground">
            <Star aria-hidden className="size-3.5 fill-current" />
            {listing.rating.toFixed(1)}
          </span>
        </p>
        <p className="truncate text-sm text-muted-foreground">{listing.title}</p>
        <p className="truncate text-sm text-muted-foreground">{listing.meta}</p>
        <p className="text-sm text-muted-foreground">{listing.dates}</p>
        <p className="mt-1 text-sm text-foreground">
          <span className="font-semibold">{listing.price}</span> per person
        </p>
      </div>
    </article>
  );
}

export function AirbnbListingPage({
  listings = defaultListings,
  rail = defaultRail,
  heading = "Boat trips out of Renaissance Marina",
  mapQuery = "Renaissance Marina, Oranjestad, Aruba",
  brand = "Blue Water Sail",
}: {
  listings?: Listing[];
  rail?: RailItem[];
  heading?: string;
  mapQuery?: string;
  brand?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [saved, setSaved] = React.useState<string[]>([]);
  const [showMap, setShowMap] = React.useState(false);

  const toggleSave = (title: string) =>
    setSaved((s) => (s.includes(title) ? s.filter((t) => t !== title) : [...s, title]));

  const label = rail[active]?.label ?? "All trips";
  const shown =
    active === 0 ? listings : listings.filter((l) => l.category === label);

  const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-70.075%2C12.495%2C-69.985%2C12.560&layer=mapnik&marker=12.5203%2C-70.0270";

  return (
    <div id="top" className="relative bg-background">
      <PageNav brand={brand} variant="compact" />

      <main>
        <h1 className="sr-only">{heading}</h1>

        {/* Category rail */}
        <div className="sticky top-0 z-20 border-b border-border bg-background">
          <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-6">
            <nav
              aria-label="Trip categories"
              className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <ul className="flex items-stretch gap-8 py-2">
                {rail.map((r, i) => {
                  const Cmp = categoryIcons[r.icon];
                  const on = i === active;
                  return (
                    <li key={r.label}>
                      <button
                        type="button"
                        aria-current={on ? "true" : undefined}
                        onClick={() => setActive(i)}
                        className={cn(
                          "flex cursor-pointer flex-col items-center gap-1 border-b-2 px-1 pt-2 pb-2 text-[11px] whitespace-nowrap transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          on
                            ? "border-foreground font-semibold text-foreground"
                            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                        )}
                      >
                        <Cmp aria-hidden className="size-5" />
                        {r.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <button
              type="button"
              aria-pressed={showMap}
              onClick={() => setShowMap((m) => !m)}
              className="hidden shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none lg:inline-flex"
            >
              {showMap ? (
                <X aria-hidden className="size-4" />
              ) : (
                <Map aria-hidden className="size-4" />
              )}
              {showMap ? "Hide the map" : "Show the map"}
            </button>
          </div>
        </div>

        {/* Results */}
        <section aria-label="Trips available" className="mx-auto max-w-[1600px] px-6 pt-6 pb-16">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {shown.length} {shown.length === 1 ? "trip" : "trips"} in {label.toLowerCase()},
            departing from {mapQuery}
          </p>

          {shown.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm font-semibold text-foreground">
                No boats under {label.toLowerCase()} this week
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another category, or call Slip 14 and we will move something.
              </p>
              <button
                type="button"
                onClick={() => setActive(0)}
                className="mt-6 cursor-pointer rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Show every trip
              </button>
            </div>
          ) : showMap ? (
            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
                {shown.map((l) => (
                  <li key={l.title + l.dates}>
                    <ListingCard
                      listing={l}
                      compact
                      saved={saved.includes(l.title)}
                      onSave={() => toggleSave(l.title)}
                    />
                  </li>
                ))}
              </ul>
              <div className="lg:h-[calc(100vh-9rem)] lg:sticky lg:top-28">
                <div className="h-[420px] overflow-hidden rounded-2xl border border-border lg:h-full">
                  <iframe
                    title={`Map of trips departing from ${mapQuery}`}
                    src={mapSrc}
                    loading="lazy"
                    className="size-full border-0"
                  />
                </div>
              </div>
            </div>
          ) : (
            <ul className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((l) => (
                <li key={l.title + l.dates}>
                  <ListingCard
                    listing={l}
                    saved={saved.includes(l.title)}
                    onSave={() => toggleSave(l.title)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-14 flex flex-col items-center gap-3 border-t border-border pt-10">
            <p className="text-sm font-semibold text-foreground">
              Continue exploring the marina
            </p>
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Show more trips
            </button>
          </div>
        </section>
      </main>

      <PageFooter brand={brand} variant="compact" />
    </div>
  );
}
