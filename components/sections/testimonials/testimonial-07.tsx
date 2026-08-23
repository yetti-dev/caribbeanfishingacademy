import { Quote as QuoteIcon } from "lucide-react";
import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import type { Testimonial } from "@/content/types";

/** Trust marks ticking past above one featured quote. Credibility, then a voice. */
export function Testimonial07({
  eyebrow,
  logos,
  testimonial,
}: {
  eyebrow?: string;
  logos: string[];
  testimonial: Testimonial;
}) {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {eyebrow ? <p className="eyebrow text-center text-muted-foreground">{eyebrow}</p> : null}
        <div className="relative mt-8 overflow-hidden">
          <Marquee pauseOnHover className="[--marquee-duration:32s] [--marquee-gap:3rem]">
            {logos.map((name) => (
              <span key={name} className="shrink-0 font-mono text-sm font-semibold tracking-wide whitespace-nowrap text-muted-foreground">
                {name}
              </span>
            ))}
          </Marquee>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-card to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-card to-transparent" />
        </div>
        <Reveal className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border bg-background p-8 sm:p-12">
          <QuoteIcon aria-hidden className="size-7 text-primary" />
          <blockquote className="mt-6 font-display text-2xl font-semibold leading-snug tracking-tight text-balance text-foreground sm:text-4xl">
            {testimonial.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            {testimonial.avatar ? (
              <img src={testimonial.avatar.src} alt={testimonial.avatar.alt} loading="lazy" decoding="async" className="size-12 rounded-full object-cover" />
            ) : null}
            <span className="text-sm">
              <span className="block font-semibold text-foreground">{testimonial.name}</span>
              {testimonial.role ? <span className="block text-muted-foreground">{testimonial.role}</span> : null}
            </span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
