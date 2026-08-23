"use client";

import * as React from "react";
import { MessageCircleQuestion, Search } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Live search over the question list, with a running result count and an
 * empty state that hands the visitor a way to reach a human.
 */
export function Faq05({ heading, items, cta, placeholder = "Search the questions" }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta; placeholder?: string;
}) {
  const [query, setQuery] = React.useState("");
  const term = query.trim().toLowerCase();
  const results = term
    ? items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(term))
    : items;

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-3xl px-6">
        {heading ? (
          <Reveal className="text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-10">
          <label htmlFor="faq05-search" className="sr-only">{placeholder}</label>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="faq05-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-full border border-border bg-card py-4 pl-12 pr-5 text-base text-foreground shadow-sm transition duration-200 ease-out placeholder:text-muted-foreground hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            />
          </div>
          <p aria-live="polite" className="mt-3 pl-1 font-mono text-xs text-muted-foreground">
            {results.length} of {items.length} questions
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
            {results.map((item) => (
              <div key={item.q} className="p-6">
                <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
              <MessageCircleQuestion aria-hidden className="size-6" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">Nothing matches that yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Try a shorter word, or ask the crew straight out. Someone at the slip answers within the hour.
            </p>
            {cta ? (
              <a href={cta.href} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                {cta.label}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
