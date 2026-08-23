"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";
import type { Cta, Feature, SectionHeading } from "@/content/types";

export type TabItem = Feature & {
  /** Short label for the tab strip; falls back to the title. */
  tab?: string;
  bullets?: string[];
  meta?: string;
  cta?: Cta;
};

/**
 * Tabbed feature panel.
 *
 * Rebuilt as a real tablist: roving tabindex, arrow and Home/End keys, and
 * aria-controls wiring, so it is operable from the keyboard rather than being a
 * row of buttons that happen to swap a picture.
 *
 * The strip is horizontal and scrollable on small screens, with an animated
 * underline on the active tab. The panel crossfades its photo and slides its
 * copy in, keyed on the index so the transition replays per tab. A progress
 * counter makes it obvious there is more than one.
 */
export function Feature05({ heading, features, autoAdvance = 0 }: {
  heading: SectionHeading;
  features: TabItem[];
  /** Milliseconds between automatic advances. 0 disables it. */
  autoAdvance?: number;
}) {
  const [active, setActive] = useState(0);
  const [motionOk, setMotionOk] = useState(true);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = features[active];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!autoAdvance || !motionOk || features.length < 2) return;
    const t = setInterval(() => setActive((n) => (n + 1) % features.length), autoAdvance);
    return () => clearInterval(t);
  }, [autoAdvance, motionOk, features.length]);

  const focusTab = useCallback((i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const last = features.length - 1;
    if (e.key === "ArrowRight") { e.preventDefault(); focusTab(active === last ? 0 : active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); focusTab(active === 0 ? last : active - 1); }
    else if (e.key === "Home") { e.preventDefault(); focusTab(0); }
    else if (e.key === "End") { e.preventDefault(); focusTab(last); }
  };

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </div>
          <p className="eyebrow shrink-0 text-muted-foreground">
            {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
          </p>
        </div>

        {/* Horizontal tab strip, scrollable when it runs out of room. */}
        <div
          role="tablist" aria-label={heading.title} onKeyDown={onKey}
          className="mt-10 flex gap-1 overflow-x-auto border-b border-border pb-px"
        >
          {features.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.title}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button" role="tab" id={`feat05-tab-${i}`}
                aria-selected={on} aria-controls={`feat05-panel-${i}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex shrink-0 cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon name={f.icon} className={cn("size-4 transition-colors duration-200", on ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {f.tab ?? f.title}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-primary transition-transform duration-300 ease-out",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Panels: only the active one is in the tree, keyed so it re-animates. */}
        <div
          role="tabpanel" id={`feat05-panel-${active}`} aria-labelledby={`feat05-tab-${active}`}
          className="mt-10 grid items-center gap-10 lg:grid-cols-2"
        >
          <div key={`copy-${active}`} className={cn(motionOk && "animate-[fadeUp_450ms_ease-out]")}>
            {current.meta ? <p className="eyebrow text-muted-foreground">{current.meta}</p> : null}
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground">{current.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{current.body}</p>
            {current.bullets?.length ? (
              <ul className="mt-6 space-y-2.5">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {b}
                  </li>
                ))}
              </ul>
            ) : null}
            {current.cta ? (
              <a href={current.cta.href} className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                {current.cta.label}
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </div>

          {/* Every photo stays mounted so switching tabs never re-downloads one. */}
          <div className="relative isolate aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {features.map((f, i) =>
              f.image ? (
                <img
                  key={f.image.src} src={f.image.src} alt={i === active ? f.image.alt : ""} aria-hidden={i !== active}
                  loading={i === 0 ? "eager" : "lazy"} decoding="async"
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-all duration-700 ease-out",
                    i === active ? "z-10 scale-100 opacity-100" : "z-0 scale-105 opacity-0",
                  )}
                />
              ) : null,
            )}
            {!current.image ? (
              <p className="absolute inset-0 z-10 grid place-items-center p-8 text-center text-base leading-relaxed text-muted-foreground">
                {current.body}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
