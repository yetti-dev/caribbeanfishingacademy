"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Quote as QuoteIcon } from "lucide-react";
import type { SectionHeading, Testimonial } from "@/content/types";
import { cn } from "@/lib/utils";

/** Split slider: a full height photo on one side, the quote and controls on the other. */
export function Testimonial04({
  heading,
  testimonials,
}: {
  heading?: SectionHeading;
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = React.useState(0);
  const count = testimonials.length;
  const go = React.useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);
  const current = testimonials[index];

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  }

  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <div className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          </div>
        ) : null}
        <div
          role="group"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Guest reviews, use the left and right arrow keys to change review"
          onKeyDown={onKeyDown}
          className="mt-12 grid overflow-hidden rounded-3xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none lg:grid-cols-2"
        >
          <div className="bg-muted">
            {current.avatar ? (
              <img
                key={current.avatar.src}
                src={current.avatar.src}
                alt={current.avatar.alt}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover lg:h-full lg:min-h-[26rem]"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
            <div>
              <QuoteIcon aria-hidden className="size-7 text-primary" />
              <blockquote aria-live="polite" className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-balance text-foreground sm:text-3xl">
                {current.quote}
              </blockquote>
              <p className="mt-6 text-sm">
                <span className="block font-semibold text-foreground">{current.name}</span>
                {current.role ? <span className="block text-muted-foreground">{current.role}</span> : null}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1.5" aria-hidden>
                {testimonials.map((t, i) => (
                  <span key={t.name} className={cn("h-1.5 rounded-full transition-all duration-300 ease-out", i === index ? "w-6 bg-primary" : "w-1.5 bg-border")} />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-background text-foreground transition duration-200 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <ArrowLeft aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-primary text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <ArrowRight aria-hidden className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
