import { Reveal } from "@/components/magic/reveal";
import type { Quote as QuoteData } from "@/content/demo";

/**
 * The founder speaking, next to their own face. The portrait keeps its own
 * panel and the words sit on a solid surface beside it, never on top of the
 * photograph. The name is set in the display face like a signed note.
 */
export function Quote02({
  quote,
  since,
}: {
  quote: QuoteData;
  since?: string;
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-stretch gap-0 overflow-hidden rounded-3xl border border-border md:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="bg-muted">
            {quote.image ? (
              <div className="aspect-4/5 size-full md:aspect-auto md:h-full md:min-h-[26rem]">
                <img
                  src={quote.image.src}
                  alt={quote.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center bg-card p-8 sm:p-12 lg:p-16">
            <blockquote>
              <p className="font-display text-2xl leading-[1.25] font-medium tracking-tight text-balance text-card-foreground sm:text-3xl">
                {quote.text}
              </p>
            </blockquote>
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-display text-2xl font-bold tracking-tight text-primary">{quote.author}</p>
              {quote.role ? (
                <p className="mt-1 text-sm text-muted-foreground">{quote.role}</p>
              ) : null}
              {since ? (
                <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground">{since}</p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
