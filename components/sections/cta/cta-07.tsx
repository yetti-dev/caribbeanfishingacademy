import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading, Stat } from "@/content/types";

/** Proof first: three numbers hold the left, the ask sits in a card on the right. */
export function Cta07({ heading, stats = [], primary, secondary, footnote }: {
  heading: SectionHeading; stats?: Stat[]; primary?: CtaLink; secondary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="border-y border-border bg-muted py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-20">
        <RevealGroup className="divide-y divide-border">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="flex items-baseline justify-between gap-6 py-6 first:pt-0 last:pb-0">
              <span className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">{s.value}{s.suffix ?? ""}</span>
              <span className="max-w-[14rem] text-right text-sm leading-relaxed text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </RevealGroup>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            <div className="mt-8 flex flex-col gap-3">
              {primary ? (
                <a href={primary.href} className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                  {primary.label}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </a>
              ) : null}
              {secondary ? (
                <a href={secondary.href} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                  {secondary.label}
                </a>
              ) : null}
            </div>
            {footnote ? <p className="mt-5 text-xs text-muted-foreground">{footnote}</p> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
