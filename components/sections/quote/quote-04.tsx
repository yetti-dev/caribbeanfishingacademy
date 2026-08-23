import { Quote as QuoteMark } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/magic/reveal";
import type { Quote as QuoteData } from "@/content/demo";

/**
 * Three short lines in a single row, divided by vertical rules rather than card
 * borders. Reads as one thought split three ways, not as a testimonial grid.
 */
export function Quote04({ eyebrow, quotes }: { eyebrow?: string; quotes: QuoteData[] }) {
  return (
    <section className="border-b border-border bg-muted py-20">
      <div className="mx-auto max-w-7xl px-6">
        {eyebrow ? (
          <Reveal>
            <p className="eyebrow text-primary">{eyebrow}</p>
          </Reveal>
        ) : null}
        <RevealGroup className="mt-10 grid gap-y-12 md:grid-cols-3 md:gap-x-0">
          {quotes.map((q, i) => (
            <figure
              key={q.author}
              className="px-0 md:px-10 md:not-first:border-l md:not-first:border-border md:first:pl-0 md:last:pr-0"
            >
              <QuoteMark aria-hidden className="size-5 text-primary" />
              <blockquote className="mt-5">
                <p className="font-display text-xl leading-snug font-semibold tracking-tight text-balance text-foreground">
                  {q.text}
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="font-mono text-xs tracking-wide text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="mx-2 text-muted-foreground">
                  /
                </span>
                <span className="text-sm font-medium text-foreground">{q.author}</span>
                {q.role ? <span className="block text-xs text-muted-foreground">{q.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
