"use client";

import * as React from "react";
import { ArrowRight, Camera } from "lucide-react";
import { Gallery } from "@/components/magic/gallery";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { InstagramIcon } from "@/components/icons";
import { demoGallery } from "@/content/demo";
import type { Img } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * PAGE-GALLERY
 *
 * An album page: a wide heading block, category tabs that really filter, the
 * masonry Gallery with its lightbox, and a closing CTA. Client because the
 * tabs hold state.
 */

export type GalleryCategory = { label: string; match: (image: Img, index: number) => boolean };

const defaultCategories: GalleryCategory[] = [
  { label: "Everything", match: () => true },
  { label: "Under water", match: (im) => /snorkel|coral|reef|water/i.test(im.alt) },
  { label: "On deck", match: (im) => /deck|bench|helm|crew|bow/i.test(im.alt) },
  { label: "The boats", match: (im) => /sailboat|catamaran|boat/i.test(im.alt) },
  { label: "Golden hour", match: (im) => /evening|orange|first light|sky/i.test(im.alt) },
];

export function GalleryPage({
  images = demoGallery,
  categories = defaultCategories,
  eyebrow = "The logbook, in pictures",
  heading = "Twelve seasons of water, shot from the deck",
  intro = "Guests send us more photographs than we could ever print. These are the ones the crew argued about, taken between Slip 14 and the sand bar at the far end of the reef.",
  ctaTitle = "Your evening could look like this",
  ctaBody = "Twelve guests maximum, two crew, and the ladder goes down wherever the water is best that day.",
  ctaLabel = "Check the sailing calendar",
  ctaHref = "#book",
  brand = "Blue Water Sail",
}: {
  images?: Img[];
  categories?: GalleryCategory[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaHref?: string;
  brand?: string;
}) {
  const [tab, setTab] = React.useState(0);
  const current = categories[tab] ?? categories[0];
  const shown = images.filter((im, i) => current.match(im, i));

  return (
    <div id="top" className="relative bg-background">
      <PageNav brand={brand} variant="editorial" />

      <main>
        {/* Heading block */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="eyebrow text-primary">{eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.98] font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                {heading}
              </h1>
            </div>
            <div className="lg:pb-2">
              <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>
              <p className="mt-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                <Camera aria-hidden className="size-4 text-primary" />
                {images.length} frames, no filters
              </p>
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div
            role="tablist"
            aria-label="Photo categories"
            className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c, i) => {
              const on = i === tab;
              return (
                <button
                  key={c.label}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(i)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                    on
                      ? "bg-primary font-medium text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
            <p aria-live="polite" className="ml-auto hidden self-center text-xs text-muted-foreground sm:block">
              {shown.length} of {images.length}
            </p>
          </div>
        </div>

        {/* Masonry */}
        <section aria-label="Photo album" className="mx-auto max-w-7xl px-6 py-12">
          {shown.length > 0 ? (
            <Gallery images={shown.map((im) => ({ src: im.src, alt: im.alt }))} />
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">
              Nothing filed under {current.label} yet. The crew is still sorting the card
              from last week.
            </p>
          )}
        </section>

        {/* Closing CTA */}
        <section aria-label="Book a trip" className="border-t border-border bg-primary">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
                {ctaTitle}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/90">
                {ctaBody}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:ml-auto">
              <a
                href={ctaHref}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {ctaLabel}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Follow the crew on Instagram"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary-foreground/40 px-5 py-3 text-sm font-medium text-primary-foreground transition duration-200 ease-out hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <InstagramIcon className="size-4" />
                More on Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <PageFooter brand={brand} variant="editorial" />
    </div>
  );
}
