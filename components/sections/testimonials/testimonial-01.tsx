import { Quote as QuoteIcon } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Testimonial } from "@/content/types";

/** One oversized pull quote, centred, giant display type and a tiny attribution. */
export function Testimonial01({ eyebrow, testimonial }: { eyebrow?: string; testimonial: Testimonial }) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
          <QuoteIcon aria-hidden className="mx-auto mt-6 size-8 text-primary" />
          <blockquote className="mt-8">
            <p className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-3">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt}
                loading="lazy"
                decoding="async"
                className="size-10 rounded-full object-cover"
              />
            ) : null}
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              <span className="text-foreground">{testimonial.name}</span>
              {testimonial.role ? <span>, {testimonial.role}</span> : null}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
