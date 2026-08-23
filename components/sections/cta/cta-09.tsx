import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading } from "@/content/types";

/**
 * Editorial. Hairline top and bottom, no box, and the button rides inline in
 * the last line of the headline.
 */
export function Cta09({ heading, tail, primary, footnote }: {
  heading: SectionHeading; tail?: string; primary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="border-y border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-muted-foreground">{heading.eyebrow}</p> : null}
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {heading.title}
            {tail ? <span className="text-muted-foreground"> {tail}</span> : null}
            {primary ? (
              <a
                href={primary.href}
                className="group ml-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 align-middle text-base font-semibold tracking-normal text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:text-lg"
              >
                {primary.label}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </a>
            ) : null}
          </h2>
          {heading.body ? <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          {footnote ? <p className="mt-6 font-mono text-xs tracking-wide text-muted-foreground">{footnote}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
