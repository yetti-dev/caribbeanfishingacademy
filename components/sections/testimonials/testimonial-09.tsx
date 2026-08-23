import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { SectionHeading, Testimonial } from "@/content/types";

/** Editorial list. Oversized numerals sit in the margin and the alignment alternates. */
export function Testimonial09({ heading, testimonials }: { heading: SectionHeading; testimonials: Testimonial[] }) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
        </Reveal>
        <ol className="mt-16 space-y-16">
          {testimonials.map((t, i) => {
            const flipped = i % 2 === 1;
            return (
              <Reveal as="li" key={t.name} delay={0.05}>
                <div className={cn("flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8", flipped && "sm:flex-row-reverse sm:text-right")}>
                  <span aria-hidden className="font-display text-6xl font-bold leading-none tracking-tight text-primary/25 sm:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={cn("max-w-2xl", flipped && "sm:ml-auto")}>
                    <blockquote className="font-display text-xl leading-snug tracking-tight text-balance text-foreground sm:text-2xl">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <p className={cn("mt-4 flex items-center gap-2.5 text-sm", flipped && "sm:justify-end")}>
                      {t.avatar ? (
                        <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-8 rounded-full object-cover" />
                      ) : null}
                      <span className="font-semibold text-foreground">{t.name}</span>
                      {t.role ? <span className="text-muted-foreground">{t.role}</span> : null}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
