import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Two independent accordion columns. No chevron: a plus swaps to a minus.
 * Each details element is its own group, so several can stand open at once.
 */
export function Faq02({ heading, items, cta }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta;
}) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="max-w-3xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-x-12 gap-y-4 md:grid-cols-2">
          {columns.map((column, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {column.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border bg-card p-5 transition-shadow duration-300 ease-out hover:shadow-lg open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-base font-semibold tracking-tight text-foreground">{item.q}</span>
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Plus aria-hidden className="size-4 group-open:hidden" />
                      <Minus aria-hidden className="hidden size-4 group-open:block" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>

        {cta ? (
          <p className="mt-12 text-sm text-muted-foreground">
            Still stuck?{" "}
            <a href={cta.href} className="cursor-pointer font-semibold text-primary underline underline-offset-4 transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">{cta.label}</a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
