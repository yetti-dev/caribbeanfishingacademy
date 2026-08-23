import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Tight two column definition list. The last cell of the grid is not a
 * question at all, it is the card that catches whoever did not find one.
 */
export function Faq10({ heading, items, cta, ctaTitle = "Still have questions?", ctaBody }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta; ctaTitle?: string; ctaBody?: string;
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="max-w-xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
            {heading.body ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {items.map((item) => (
            <RevealItem key={item.q}>
              <dl className="border-l-2 border-border pl-5 transition-colors duration-200 ease-out hover:border-primary">
                <dt className="font-display text-base font-semibold tracking-tight text-foreground">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
              </dl>
            </RevealItem>
          ))}

          {cta ? (
            <RevealItem>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-accent p-6">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-accent-foreground">{ctaTitle}</h3>
                  {ctaBody ? <p className="mt-2 text-sm leading-relaxed text-accent-foreground/80">{ctaBody}</p> : null}
                </div>
                <a href={cta.href} className="group mt-5 inline-flex cursor-pointer items-center gap-1.5 self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                  {cta.label}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </RevealItem>
          ) : null}
        </RevealGroup>
      </div>
    </section>
  );
}
