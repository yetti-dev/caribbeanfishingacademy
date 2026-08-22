"use client";
import { CalendarDays, Users, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Img } from "@/content/types";

/** Dark hero with an inline booking form. The form is the point. */
export function Hero07({ eyebrow, title, body, image, tours = [], action = "#book", ctaLabel = "Check availability" }: {
  eyebrow?: string; title: string; body: string; image: Img; tours?: string[]; action?: string; ctaLabel?: string;
}) {
  const field = "h-12 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none";
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-background/70">{eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/75">{body}</p>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="mt-8 aspect-16/9 w-full rounded-xl object-cover" />
        </Reveal>

        <Reveal delay={0.1}>
          <form action={action} className="rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight">Book a trip</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live availability. No card needed to hold a spot.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="h7-tour" className="mb-1.5 block text-xs font-medium text-foreground">Trip</label>
                <select id="h7-tour" name="tour" className={`${field} cursor-pointer`}>
                  {tours.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="h7-date" className="mb-1.5 block text-xs font-medium text-foreground">Date</label>
                  <div className="relative">
                    <CalendarDays aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="h7-date" name="date" type="date" className={`${field} pl-9 cursor-pointer`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="h7-guests" className="mb-1.5 block text-xs font-medium text-foreground">Guests</label>
                  <div className="relative">
                    <Users aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="h7-guests" name="guests" type="number" min={1} max={12} defaultValue={2} className={`${field} pl-9`} />
                  </div>
                </div>
              </div>
              <button type="submit" className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                {ctaLabel}
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
