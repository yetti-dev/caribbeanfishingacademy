import { Reveal } from "@/components/magic/reveal";
import type { Cta, FaqItem, SectionHeading } from "@/content/types";

/**
 * Sticky heading left, scrolling question list right. Nothing toggles, every
 * answer is on the page for scanning and for search engines.
 */
export function Faq03({ heading, items, cta }: {
  heading?: SectionHeading; items: FaqItem[]; cta?: Cta;
}) {
  return (
    <section className="border-b border-border bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading ? (
              <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            ) : null}
            {heading?.body ? <p className="mt-5 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            {cta ? (
              <a href={cta.href} className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                {cta.label}
              </a>
            ) : null}
          </Reveal>
        </div>

        <ol className="space-y-0">
          {items.map((item, i) => (
            <Reveal key={item.q} as="li" delay={i * 0.04} className="grid gap-4 border-b border-border py-8 first:pt-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
              <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{item.q}</h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
