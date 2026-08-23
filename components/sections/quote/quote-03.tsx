import { Reveal } from "@/components/magic/reveal";
import type { Quote as QuoteData } from "@/content/demo";

/**
 * An editorial pull quote set inside a reading column and allowed to break out
 * past it on both sides. Hairline above, hairline below, no panel and no fill,
 * so it reads as a change of voice rather than a card.
 */
export function Quote03({
  quote,
  before = [],
  after = [],
}: {
  quote: QuoteData;
  before?: string[];
  after?: string[];
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-2xl px-6">
        {before.map((p, i) => (
          <Reveal key={p.slice(0, 32)} delay={i * 0.05}>
            <p className="mb-6 text-lg leading-relaxed text-foreground">{p}</p>
          </Reveal>
        ))}

        <Reveal className="my-12 sm:-mx-16 lg:-mx-28">
          <figure className="border-y border-border py-10">
            <blockquote>
              <p className="font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                {quote.text}
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-baseline gap-3">
              <span aria-hidden className="h-px w-8 shrink-0 bg-primary" />
              <span className="text-sm font-medium text-foreground">{quote.author}</span>
              {quote.role ? (
                <span className="text-sm text-muted-foreground">{quote.role}</span>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>

        {after.map((p, i) => (
          <Reveal key={p.slice(0, 32)} delay={i * 0.05}>
            <p className="mb-6 text-lg leading-relaxed text-foreground">{p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
