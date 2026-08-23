import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Inverted panel: the page flips to the dark surface for one section. Oversized
 * numerals carry the rhythm, native details keeps it JavaScript free.
 */
export function Faq07({ heading, items, cta }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta;
}) {
  return (
    <section className="bg-foreground py-20 text-background lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? (
          <Reveal className="max-w-3xl">
            {heading.eyebrow ? <p className="eyebrow opacity-70">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl">{heading.title}</h2>
            {heading.body ? <p className="mt-5 text-lg leading-relaxed opacity-80">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-14 border-t border-background/20">
          {items.map((item, i) => (
            <details key={item.q} className="group border-b border-background/20">
              <summary className="flex cursor-pointer list-none items-baseline gap-6 py-7 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="font-mono text-3xl font-bold tabular-nums opacity-30 transition-opacity duration-300 group-hover:opacity-70 group-open:opacity-100 sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-2xl font-semibold tracking-tight text-balance transition-opacity duration-200 group-hover:opacity-80 sm:text-3xl">{item.q}</span>
                <ChevronDown aria-hidden className="size-6 shrink-0 self-center opacity-60 transition-transform duration-300 ease-out group-open:rotate-180" />
              </summary>
              <p className="max-w-3xl pb-8 pl-0 text-base leading-relaxed opacity-80 sm:pl-[5.5rem] sm:text-lg">{item.a}</p>
            </details>
          ))}
        </div>

        {cta ? (
          <a href={cta.href} className="mt-12 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none">
            {cta.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
