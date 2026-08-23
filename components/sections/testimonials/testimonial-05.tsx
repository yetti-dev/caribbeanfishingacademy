import { Star } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading, Testimonial } from "@/content/types";

function Stars({ score, className }: { score: number; className?: string }) {
  return (
    <span role="img" aria-label={`${score} out of 5`} className={className ?? "flex gap-0.5"}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={i < Math.round(score) ? "size-4 fill-current text-primary" : "size-4 text-muted-foreground/40"}
        />
      ))}
    </span>
  );
}

/** Ratings first: a big average panel beside a compact list of starred reviews. */
export function Testimonial05({
  heading,
  score,
  reviewCount,
  source,
  testimonials,
}: {
  heading: SectionHeading;
  score: number;
  reviewCount: string;
  source?: string;
  testimonials: Testimonial[];
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 lg:sticky lg:top-24">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <p className="mt-4 font-display text-7xl font-bold leading-none tracking-tight text-foreground">{score.toFixed(1)}</p>
            <Stars score={score} className="mt-4 flex gap-1" />
            <p className="mt-3 text-sm text-muted-foreground">
              {reviewCount} verified reviews{source ? ` on ${source}` : ""}
            </p>
            <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-balance text-foreground">{heading.title}</h2>
            {heading.body ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </div>
        </Reveal>
        <RevealGroup className="divide-y divide-border">
          {testimonials.map((t) => (
            <RevealItem key={t.name} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-10 rounded-full object-cover" />
                  ) : null}
                  <span className="text-sm">
                    <span className="block font-semibold text-foreground">{t.name}</span>
                    {t.role ? <span className="block text-xs text-muted-foreground">{t.role}</span> : null}
                  </span>
                </div>
                <Stars score={5} />
              </div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
