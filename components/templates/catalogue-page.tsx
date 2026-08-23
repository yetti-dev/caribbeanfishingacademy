"use client";

import * as React from "react";
import { Clock, MapPin, SlidersHorizontal, Star, X } from "lucide-react";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { demoFacets, demoTours, type Tour } from "@/content/demo";
import { cn } from "@/lib/utils";

/**
 * PAGE-CATALOGUE
 *
 * The filtered catalogue: a sticky facet bar of chips plus a sort select, a
 * live results count, a card grid that pages in with load more, and an empty
 * state that actually resets the filters. Client throughout because every
 * control is real, not decorative.
 */

export type Facet = { label: string; options: string[] };

const PAGE_SIZE = 3;

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
  { key: "rating", label: "Best rated" },
];

const amount = (p: string) => Number(p.replace(/[^0-9.]/g, "")) || 0;

/** A tour matches a chip when the chip text shows up in its tags, duration or price band. */
function matches(tour: Tour, option: string) {
  const hay = `${tour.title} ${tour.body} ${tour.duration} ${tour.tags.join(" ")}`.toLowerCase();
  const price = amount(tour.price);
  switch (option) {
    case "Under 2 hours":
      return /^\d(\.\d)?\s*hour/.test(tour.duration) && amount(tour.duration) < 2;
    case "Half day":
      return amount(tour.duration) >= 2 && amount(tour.duration) <= 4;
    case "Full day":
      return /full day/i.test(hay) || amount(tour.duration) >= 5;
    case "Multi day":
      return /multi|overnight/i.test(hay);
    case "Morning":
      return /morning|dolphin|first light/i.test(hay);
    case "Midday":
      return /lunch|island|reef/i.test(hay);
    case "Sunset":
      return /sunset|evening|golden/i.test(hay);
    case "Families":
      return /family|children|kids/i.test(hay);
    case "Couples":
      return /sunset|dinner|private/i.test(hay);
    case "Divers":
      return /snorkel|reef|dive/i.test(hay);
    case "Groups":
      return /private|charter|group/i.test(hay);
    case "Under $60":
      return price < 60;
    case "$60 to $100":
      return price >= 60 && price <= 100;
    case "$100 to $200":
      return price > 100 && price <= 200;
    case "$200 plus":
      return price > 200;
    default:
      return hay.includes(option.toLowerCase());
  }
}

function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <a
        href="#detail"
        className="cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tour.image.src}
            alt={tour.image.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <h3 className="min-w-0 flex-1 font-display text-lg leading-snug font-semibold tracking-tight text-foreground">
            <a
              href="#detail"
              className="cursor-pointer transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {tour.title}
            </a>
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-foreground">
            <Star aria-hidden className="size-3.5 fill-current text-primary" />
            {tour.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tour.body}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {tour.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3.5" />
            {tour.from}
          </span>
          <span>{tour.reviews} reviews</span>
        </p>
        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-xl font-bold text-foreground">{tour.price}</span>{" "}
            per guest
          </p>
          <a
            href="#book"
            className="ml-auto cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Check dates
          </a>
        </div>
      </div>
    </article>
  );
}

export function CataloguePage({
  tours = demoTours,
  facets = demoFacets,
  eyebrow = "Every trip we run",
  heading = "Six ways off the dock at Slip 14",
  intro = "Filter by how long you have, when you want to leave and who is coming. Prices are per guest and include lunch, gear and the crew.",
  brand = "Blue Water Sail",
}: {
  tours?: Tour[];
  facets?: Facet[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  brand?: string;
}) {
  const [active, setActive] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<SortKey>("recommended");
  const [shown, setShown] = React.useState(PAGE_SIZE);

  const toggle = (option: string) => {
    setShown(PAGE_SIZE);
    setActive((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  };

  const reset = () => {
    setActive([]);
    setSort("recommended");
    setShown(PAGE_SIZE);
  };

  const results = React.useMemo(() => {
    const filtered = active.length
      ? tours.filter((t) => active.every((o) => matches(t, o)))
      : tours.slice();
    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => amount(a.price) - amount(b.price));
      case "price-desc":
        return filtered.sort((a, b) => amount(b.price) - amount(a.price));
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      default:
        return filtered;
    }
  }, [tours, active, sort]);

  const visible = results.slice(0, shown);
  const more = results.length - visible.length;

  return (
    <div id="top" className="relative bg-background">
      <PageNav brand={brand} variant="plain" />

      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        </section>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-20 border-y border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-3">
            <div className="flex items-start gap-4">
              <p className="hidden shrink-0 items-center gap-2 pt-1.5 text-sm font-medium text-foreground sm:inline-flex">
                <SlidersHorizontal aria-hidden className="size-4 text-muted-foreground" />
                Filter
              </p>
              <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ul className="flex items-center gap-2">
                  {facets.flatMap((f) =>
                    f.options.map((o) => {
                      const on = active.includes(o);
                      return (
                        <li key={`${f.label}-${o}`}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(o)}
                            className={cn(
                              "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                              on
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                            )}
                          >
                            {o}
                          </button>
                        </li>
                      );
                    }),
                  )}
                </ul>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <label htmlFor="catalogue-sort" className="sr-only">
                  Sort trips
                </label>
                <select
                  id="catalogue-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p aria-live="polite" className="text-xs text-muted-foreground">
                {results.length} {results.length === 1 ? "trip" : "trips"} match
                {active.length ? ` ${active.length} filters` : " right now"}
              </p>
              {active.length > 0 ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <X aria-hidden className="size-3" />
                  Clear all
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Results */}
        <section aria-label="Trip results" className="mx-auto max-w-7xl px-6 py-10">
          {visible.length > 0 ? (
            <>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((t) => (
                  <li key={t.title}>
                    <TourCard tour={t} />
                  </li>
                ))}
              </ul>
              {more > 0 ? (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Showing {visible.length} of {results.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShown((s) => s + PAGE_SIZE)}
                    className="cursor-pointer rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Show {Math.min(more, PAGE_SIZE)} more
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <SlidersHorizontal aria-hidden className="size-5" />
              </span>
              <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                Nothing sails with all of those filters
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Drop one and try again, or call the dock on {" "}
                <span className="text-foreground">+297 588 1420</span> and we will put
                something together.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Reset the filters
              </button>
            </div>
          )}
        </section>
      </main>

      <PageFooter brand={brand} />
    </div>
  );
}
