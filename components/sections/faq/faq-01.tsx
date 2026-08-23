import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Classic single column accordion, hairline separated. Native details/summary
 * sharing one `name`, so the browser keeps exactly one panel open and the
 * block ships zero JavaScript.
 */
export function Faq01({ heading, items, cta, groupName = "faq-01" }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta; groupName?: string;
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-3xl px-6">
        {heading ? (
          <Reveal>
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-12 border-t border-border">
          {items.map((item) => (
            <details key={item.q} name={groupName} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors duration-200 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg font-semibold tracking-tight text-foreground group-open:text-primary">{item.q}</span>
                <ChevronDown aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-open:rotate-180 group-open:text-primary" />
              </summary>
              <p className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>

        {cta ? (
          <div className="mt-10">
            <a href={cta.href} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
