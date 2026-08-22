import { Reveal, RevealGroup } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Feature, SectionHeading } from "@/content/types";

/** Three-up icon grid with a hairline divider between rows. */
export function Feature01({ heading, features }: { heading: SectionHeading; features: Feature[] }) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={f.icon} className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
