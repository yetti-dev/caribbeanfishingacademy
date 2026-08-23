import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading, Stat } from "@/content/types";

/** Copy on the left, a hairline separated 2x2 stat block on the right. */
export function About02({ heading, body = [], stats = [], footnote }: {
  heading: SectionHeading;
  body?: string[];
  stats?: Stat[];
  footnote?: string;
}) {
  return (
    <section className="border-y border-border bg-muted py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/80">{heading.body}</p>
          ) : null}
          <div className="mt-6 space-y-4">
            {body.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-xl leading-relaxed text-foreground/70">{p}</p>
            ))}
          </div>
          {footnote ? (
            <p className="mt-8 font-mono text-xs tracking-wide text-foreground/60">{footnote}</p>
          ) : null}
        </Reveal>

        <Reveal delay={0.08} className="lg:pt-2">
          <RevealGroup className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card">
            {stats.slice(0, 4).map((s, i) => (
              <RevealItem
                key={s.label}
                className={
                  i % 2 === 0
                    ? i < 2
                      ? "border-r border-b border-border p-7 sm:p-9"
                      : "border-r border-border p-7 sm:p-9"
                    : i < 2
                      ? "border-b border-border p-7 sm:p-9"
                      : "p-7 sm:p-9"
                }
              >
                <p className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {s.value}
                  {s.suffix ? <span className="text-2xl">{s.suffix}</span> : null}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </section>
  );
}
