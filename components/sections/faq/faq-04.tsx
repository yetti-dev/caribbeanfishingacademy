"use client";

import * as React from "react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/** A named bundle of questions. Defined here because FaqItem carries no category. */
export type FaqGroup = { label: string; items: FaqItem[] };

/**
 * Categorised questions behind a tab row. Real tablist semantics: roving focus,
 * arrow keys, Home and End, aria-selected and aria-controls on every tab.
 */
export function Faq04({ heading, items, groups, cta }: {
  heading?: SectionHeading; items?: FaqItem[]; groups?: FaqGroup[]; cta?: Cta;
}) {
  const tabs: FaqGroup[] = React.useMemo(() => {
    if (groups && groups.length) return groups;
    return [{ label: "All questions", items: items ?? [] }];
  }, [groups, items]);

  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  const panelId = `faq04-panel-${active}`;

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div role="tablist" aria-label="Question categories" className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              id={`faq04-tab-${i}`}
              type="button"
              aria-selected={i === active}
              aria-controls={`faq04-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                i === active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-foreground hover:bg-accent",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={panelId} aria-labelledby={`faq04-tab-${active}`} tabIndex={0} className="mt-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          <dl className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
            {tabs[active].items.map((item) => (
              <div key={item.q}>
                <dt className="font-display text-lg font-semibold tracking-tight text-foreground">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {cta ? (
          <div className="mt-12 flex justify-start">
            <a href={cta.href} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
