import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading } from "@/content/types";

export type Milestone = { year: string; title: string; body: string };

/** Vertical rail with years in the margin, a dot per entry, alternating sides on desktop. */
export function About03({ heading, milestones = [] }: {
  heading: SectionHeading;
  milestones?: Milestone[];
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </Reveal>

        <RevealGroup className="relative mt-16">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-2 w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
          />
          <ol className="space-y-12">
            {milestones.map((m, i) => (
              <RevealItem key={m.year + m.title} className="relative">
                <li className="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
                  <span
                    aria-hidden
                    className="absolute top-2 left-2 size-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary ring-4 ring-primary/15 lg:left-1/2"
                  />
                  <div className={i % 2 === 0 ? "lg:col-start-1 lg:pr-4 lg:text-right" : "lg:col-start-2 lg:pl-4"}>
                    <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{m.year}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{m.body}</p>
                  </div>
                </li>
              </RevealItem>
            ))}
          </ol>
        </RevealGroup>
      </div>
    </section>
  );
}
