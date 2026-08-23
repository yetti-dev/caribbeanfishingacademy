import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Feature, SectionHeading } from "@/content/types";

/** Long lead paragraph, then numbered value cards on an inverted panel. */
export function About05({ heading, lead, values = [] }: {
  heading: SectionHeading;
  lead?: string;
  values?: Feature[];
}) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-foreground px-6 py-16 text-background sm:px-12 lg:px-16 lg:py-20">
          <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              {heading.eyebrow ? <p className="eyebrow text-background/60">{heading.eyebrow}</p> : null}
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
                {heading.title}
              </h2>
            </div>
            <div>
              {lead ? <p className="text-lg leading-relaxed text-background/85">{lead}</p> : null}
              {heading.body ? (
                <p className="mt-4 leading-relaxed text-background/70">{heading.body}</p>
              ) : null}
            </div>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-background/15 sm:grid-cols-2">
            {values.map((v, i) => (
              <RevealItem key={v.title} className="bg-foreground p-7 sm:p-9">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs tracking-[0.2em] text-background/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {v.icon ? (
                    <span className="grid size-9 place-items-center rounded-lg bg-background/10 text-background">
                      <Icon name={v.icon} className="size-4" />
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-background/70">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
