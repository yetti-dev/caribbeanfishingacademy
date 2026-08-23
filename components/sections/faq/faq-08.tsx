"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Cta, FaqItem, Img, SectionHeading } from "@/content/types";

/**
 * Split layout: the photograph keeps its own column and never carries text.
 * The accordion is button driven with aria-expanded and a labelled region.
 */
export function Faq08({ heading, items, image, cta, caption }: {
  heading?: SectionHeading; items: FaqItem[]; image: Img; cta?: Cta; caption?: string;
}) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {caption ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{caption}</p> : null}
        </Reveal>

        <div>
          {heading ? (
            <Reveal>
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
              {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            </Reveal>
          ) : null}

          <div className="mt-10 divide-y divide-border border-y border-border">
            {items.map((item, i) => {
              const expanded = open === i;
              return (
                <div key={item.q}>
                  <h3>
                    <button
                      type="button"
                      id={`faq08-trigger-${i}`}
                      aria-expanded={expanded}
                      aria-controls={`faq08-panel-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                      className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors duration-200 ease-out hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <span className={cn("font-display text-lg font-semibold tracking-tight", expanded ? "text-primary" : "text-foreground")}>{item.q}</span>
                      <Plus aria-hidden className={cn("size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out", expanded && "rotate-45 text-primary")} />
                    </button>
                  </h3>
                  <div
                    role="region"
                    id={`faq08-panel-${i}`}
                    aria-labelledby={`faq08-trigger-${i}`}
                    hidden={!expanded}
                  >
                    <p className="pb-6 pr-10 text-base leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {cta ? (
            <a href={cta.href} className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
