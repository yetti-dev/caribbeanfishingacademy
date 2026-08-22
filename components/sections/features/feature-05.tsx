"use client";
import { useState } from "react";
import { Reveal } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";
import type { Feature, SectionHeading } from "@/content/types";

/** Tabbed features. Each tab swaps a photo and a paragraph. */
export function Feature05({ heading, features }: { heading: SectionHeading; features: Feature[] }) {
  const [active, setActive] = useState(0);
  const current = features[active];
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div role="tablist" aria-label="Features" className="space-y-2">
            {features.map((f, i) => (
              <button
                key={f.title} type="button" role="tab" aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  i === active ? "border-primary bg-accent" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40",
                )}
              >
                <Icon name={f.icon} className={cn("mt-0.5 size-5 shrink-0", i === active ? "text-primary" : "text-muted-foreground")} />
                <span>
                  <span className="block font-display text-base font-semibold tracking-tight text-foreground">{f.title}</span>
                  {i === active ? <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{f.body}</span> : null}
                </span>
              </button>
            ))}
          </div>
          <div>
            {current?.image ? (
              <img key={current.image.src} src={current.image.src} alt={current.image.alt} loading="lazy" decoding="async" className="aspect-4/3 w-full rounded-2xl border border-border object-cover" />
            ) : (
              <div className="grid aspect-4/3 w-full place-items-center rounded-2xl border border-border bg-muted p-8">
                <p className="max-w-sm text-center text-base leading-relaxed text-muted-foreground">{current?.body}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
