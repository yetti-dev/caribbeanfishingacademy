"use client";

import * as React from "react";
import type { Boat } from "@/content/demo";
import type { SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Fleet 03: tabbed fleet. A boat name tablist drives a panel that crossfades
 * between the photo and the spec list. Full keyboard support: arrows move,
 * Home and End jump to the ends, roving tabindex.
 */
export function Fleet03({
  heading,
  boats,
  footnote,
}: {
  heading?: SectionHeading;
  boats: Boat[];
  footnote?: string;
}) {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const id = React.useId();

  const focusTab = (next: number) => {
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab((active + 1) % boats.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab((active - 1 + boats.length) % boats.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(boats.length - 1);
    }
  };

  return (
    <section className="border-y border-border bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <div className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </div>
        ) : null}

        <div
          role="tablist"
          aria-label="Choose a boat"
          onKeyDown={onKeyDown}
          className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4"
        >
          {boats.map((boat, i) => (
            <button
              key={boat.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                i === active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {boat.name}
            </button>
          ))}
        </div>

        <div className="relative mt-10">
          {boats.map((boat, i) =>
            i !== active ? (
              <div
                key={boat.name}
                role="tabpanel"
                id={`${id}-panel-${i}`}
                aria-labelledby={`${id}-tab-${i}`}
                hidden
              />
            ) : (
              <div
                key={boat.name}
                role="tabpanel"
                id={`${id}-panel-${i}`}
                aria-labelledby={`${id}-tab-${i}`}
                tabIndex={0}
                className="animate-in fade-in duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <div className="grid gap-10 lg:grid-cols-2">
                <div className="aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={boat.image.src}
                    alt={boat.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="eyebrow text-muted-foreground">
                    {boat.type}, {boat.length}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                    {boat.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{boat.body}</p>

                  <dl className="mt-8 grid grid-cols-2 gap-x-8">
                    {boat.specs.map((spec) => (
                      <div key={spec.label} className="border-t border-border py-3">
                        <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 font-display text-xl font-semibold text-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {footnote ? (
          <p className="mt-10 text-sm leading-relaxed text-muted-foreground">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
