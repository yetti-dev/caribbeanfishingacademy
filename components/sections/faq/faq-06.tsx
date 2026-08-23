import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Every question in its own bordered card, nothing to toggle. Card sizes run
 * on a repeating pattern so the grid reads as authored rather than stamped.
 */
const SPANS = [
  "sm:col-span-2 lg:col-span-3",
  "sm:col-span-2 lg:col-span-3",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-4",
  "sm:col-span-2 lg:col-span-2",
];

export function Faq06({ heading, items, cta }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta;
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            </div>
            {heading.body ? <p className="max-w-md text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((item, i) => (
            <RevealItem key={item.q} className={cn("h-full", SPANS[i % SPANS.length])}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <span className="font-mono text-xs tracking-widest text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-balance text-foreground">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta ? (
          <div className="mt-10 rounded-2xl bg-primary px-8 py-8 text-primary-foreground sm:flex sm:items-center sm:justify-between">
            <p className="font-display text-xl font-semibold tracking-tight">Question that is not on the board?</p>
            <a href={cta.href} className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none sm:mt-0">
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
