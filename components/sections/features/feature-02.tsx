import { Reveal } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Feature, SectionHeading } from "@/content/types";

/** Bento grid: one large featured cell with a photo, the rest compact. */
export function Feature02({ heading, features }: { heading: SectionHeading; features: Feature[] }) {
  const [lead, ...rest] = features;
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {lead ? (
            <Reveal className="lg:row-span-2">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
                {lead.image ? (
                  <img src={lead.image.src} alt={lead.image.alt} loading="lazy" decoding="async" className="aspect-4/3 w-full object-cover" />
                ) : null}
                <div className="flex flex-1 flex-col p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Icon name={lead.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">{lead.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lead.body}</p>
                </div>
              </article>
            </Reveal>
          ) : null}
          {rest.slice(0, 4).map((f, i) => (
            <Reveal key={f.title} delay={0.06 * (i + 1)}>
              <article className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon name={f.icon} className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
