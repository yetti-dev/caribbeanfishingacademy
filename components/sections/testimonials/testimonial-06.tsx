import { Quote as QuoteIcon } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { SectionHeading, Testimonial } from "@/content/types";

/** Inverted band. No cards at all, three quotes divided by hairlines. */
export function Testimonial06({ heading, testimonials }: { heading: SectionHeading; testimonials: Testimonial[] }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            {heading.eyebrow ? <p className="eyebrow opacity-75">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{heading.title}</h2>
          </div>
          {heading.body ? <p className="max-w-sm text-sm leading-relaxed opacity-85">{heading.body}</p> : null}
        </Reveal>
        <div className="mt-14 divide-y divide-primary-foreground/25 border-y border-primary-foreground/25">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="grid gap-4 py-10 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-10">
              <QuoteIcon aria-hidden className="size-6 shrink-0 opacity-60" />
              <blockquote className="font-display text-2xl leading-snug tracking-tight text-balance sm:text-3xl">
                {t.quote}
              </blockquote>
              <p className="shrink-0 text-sm lg:text-right">
                <span className="block font-semibold">{t.name}</span>
                {t.role ? <span className="block opacity-75">{t.role}</span> : null}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
