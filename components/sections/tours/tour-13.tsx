"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import { cn } from "@/lib/utils";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Chip filtered grid. Tags drive the list, the count updates live, and an empty result says so instead of going blank. */
export function Tour13({
  heading,
  tours,
  allLabel = "Every trip",
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  allLabel?: string;
  cta?: Cta;
}) {
  const tags = React.useMemo(() => {
    const out: string[] = [];
    for (const t of tours) for (const tag of t.tags) if (!out.includes(tag)) out.push(tag);
    return out;
  }, [tours]);

  const [active, setActive] = React.useState<string | null>(null);
  const shown = active ? tours.filter((t) => t.tags.includes(active)) : tours;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            {allLabel}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag === active ? null : tag)}
              aria-pressed={tag === active}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                tag === active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-accent",
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-5 text-sm text-muted-foreground">
          {shown.length === 1 ? "One trip" : `${shown.length} trips`}
          {active ? ` tagged ${active}` : " sailing this season"}
        </p>

        {shown.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <SearchX aria-hidden className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
              Nothing sails under that tag yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Clear the filter, or call the marina office and we will build the day around you.
            </p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-6 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Show every trip
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t) => (
              <article
                key={t.title}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[3/2] w-full bg-muted">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <ul className="flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-medium text-accent-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-xl font-bold tracking-tight text-foreground">{t.price}</span>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} className="text-muted-foreground" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {cta ? (
          <div className="mt-10">
            <a
              href={cta.href}
              className="inline-flex cursor-pointer items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
