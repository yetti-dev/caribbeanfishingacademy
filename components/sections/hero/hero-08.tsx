import { ArrowRight, Clock, Star } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/** Asymmetric hero with a price card overlapping the photo edge. */
export function Hero08({ eyebrow, title, body, image, price, period, duration, rating, ctas = [] }: {
  eyebrow?: string; title: string; body: string; image: Img; price: string; period?: string; duration?: string; rating?: string; ctas?: Cta[];
}) {
  return (
    <section className="relative isolate bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <Reveal>
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-6xl font-bold leading-[0.92] tracking-tight text-balance text-foreground sm:text-7xl lg:text-8xl">{title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                  {cta.label}
                  {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/*
          The price card overlaps the photo by a negative margin, and both sit
          inside Reveal, which renders a motion.div and so opens its own stacking
          context at z-index auto. That left the paint order down to document
          order rather than intent, so it is stated explicitly here.
        */}
        <Reveal delay={0.16} className="relative isolate mt-12">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="relative z-0 aspect-21/9 w-full rounded-2xl border border-border object-cover" />
          <div className="relative z-10 mx-6 -mt-14 rounded-2xl border border-border bg-card p-6 shadow-xl sm:ml-auto sm:mr-6 sm:max-w-xs">
            <p className="eyebrow text-muted-foreground">From</p>
            <p className="mt-1 font-display text-4xl font-bold tracking-tight text-foreground">
              {price}
              {period ? <span className="ml-1.5 text-sm font-normal text-muted-foreground">{period}</span> : null}
            </p>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              {duration ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock aria-hidden className="size-4 text-primary" /> <dt className="sr-only">Duration</dt><dd>{duration}</dd>
                </div>
              ) : null}
              {rating ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star aria-hidden className="size-4 fill-current text-primary" /> <dt className="sr-only">Rating</dt><dd>{rating} guest rating</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
