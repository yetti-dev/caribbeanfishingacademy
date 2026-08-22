import { Reveal, RevealGroup } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Feature, SectionHeading } from "@/content/types";

/** Numbered list on a dark panel. Good for a process or an inclusions list. */
export function Feature04({ heading, features }: { heading: SectionHeading; features: Feature[] }) {
  return (
    <section className="bg-foreground py-20 text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          {heading.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-background/60">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 max-w-md text-base leading-relaxed text-background/70">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="divide-y divide-background/15 border-y border-background/15">
          {features.map((f, i) => (
            <div key={f.title} className="flex gap-5 py-6">
              <span className="font-mono text-sm text-background/50">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
                  <Icon name={f.icon} className="size-4.5 text-background/70" />
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-background/70">{f.body}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
