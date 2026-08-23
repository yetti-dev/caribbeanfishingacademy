import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, SectionHeading } from "@/content/types";

/** Dark panel washed with a token-built colour mesh, one oversized button. */
export function Cta06({ heading, primary, footnote }: {
  heading: SectionHeading; primary?: CtaLink; footnote?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 15% 20%, color-mix(in oklab, var(--color-primary) 45%, transparent) 0%, transparent 70%), radial-gradient(50% 70% at 85% 80%, color-mix(in oklab, var(--color-primary) 28%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-background/70">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-background sm:text-6xl lg:text-7xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-background/80">{heading.body}</p> : null}
          {primary ? (
            <a href={primary.href} className="group mt-12 inline-flex cursor-pointer items-center gap-3 rounded-full bg-background px-10 py-5 font-display text-base font-bold tracking-tight text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none sm:text-lg">
              {primary.label}
              <ArrowRight aria-hidden className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
          ) : null}
          {footnote ? <p className="mt-7 text-xs text-background/70">{footnote}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
