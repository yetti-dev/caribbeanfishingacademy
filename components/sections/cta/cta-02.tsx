import { ArrowUpRight } from "lucide-react";
import { BorderBeam } from "@/components/magic/border-beam";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading } from "@/content/types";

/** A contained card floating on a neutral page, lit by a travelling border beam. */
export function Cta02({ heading, primary, secondary, footnote }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-sm sm:p-16">
            <BorderBeam size={110} duration={9} />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
              <div>
                {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
                {heading.body ? <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                {primary ? (
                  <a href={primary.href} className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto">
                    {primary.label}
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : null}
                {secondary ? (
                  <a href={secondary.href} className="inline-flex cursor-pointer items-center gap-1.5 border-b border-border pb-0.5 text-sm font-medium text-foreground transition duration-200 ease-out hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    {secondary.label}
                  </a>
                ) : null}
                {footnote ? <p className="text-xs text-muted-foreground lg:text-right">{footnote}</p> : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
