"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw, Quote as QuoteIcon } from "lucide-react";
import type { SectionHeading, Testimonial } from "@/content/types";

/** A deck of quotes. Click the top card and it flies off to reveal the next. */
export function Testimonial08({
  heading,
  testimonials,
}: {
  heading: SectionHeading;
  testimonials: Testimonial[];
}) {
  const [order, setOrder] = React.useState(0);
  const reduce = useReducedMotion();
  const count = testimonials.length;
  const visible = [0, 1, 2].map((offset) => ({ t: testimonials[(order + offset) % count], offset }));

  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 max-w-md text-lg leading-relaxed text-foreground/70">{heading.body}</p> : null}
          <p className="mt-8 font-mono text-xs tracking-wide text-foreground/60">
            {String((order % count) + 1).padStart(2, "0")} of {String(count).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={() => setOrder((o) => o + 1)}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <RotateCcw aria-hidden className="size-4" />
            Next review
          </button>
        </div>
        <div className="relative h-[22rem]">
          <AnimatePresence initial={false}>
            {visible.reverse().map(({ t, offset }) => (
              <motion.button
                key={`${t.name}-${order + offset}`}
                type="button"
                onClick={() => setOrder((o) => o + 1)}
                aria-label={`Show the next review after ${t.name}`}
                initial={{ opacity: 0, y: reduce ? 0 : 24, scale: 0.94 }}
                animate={{ opacity: 1, y: offset * -14, scale: 1 - offset * 0.04 }}
                exit={{ opacity: 0, x: reduce ? 0 : -90, rotate: reduce ? 0 : -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: 10 - offset }}
                className="absolute inset-x-0 bottom-0 cursor-pointer rounded-3xl border border-border bg-card p-8 text-left shadow-sm transition-shadow duration-300 ease-out hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <QuoteIcon aria-hidden className="size-6 text-primary" />
                <blockquote className="mt-5 font-display text-xl leading-snug tracking-tight text-balance text-foreground sm:text-2xl">
                  {t.quote}
                </blockquote>
                <p className="mt-6 flex items-center gap-3 text-sm">
                  {t.avatar ? (
                    <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-9 rounded-full object-cover" />
                  ) : null}
                  <span>
                    <span className="block font-semibold text-foreground">{t.name}</span>
                    {t.role ? <span className="block text-muted-foreground">{t.role}</span> : null}
                  </span>
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
