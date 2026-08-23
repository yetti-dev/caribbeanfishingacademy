import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Member } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/** Editorial rows: a large portrait, a display-size name, alternating sides, hairline between. */
export function Team02({ heading, members }: { heading?: SectionHeading; members: Member[] }) {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="max-w-3xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-14 divide-y divide-border border-y border-border">
          {members.map((m, i) => (
            <RevealItem key={m.name}>
              <article className="grid items-center gap-8 py-12 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-12">
                <div
                  className={
                    i % 2 === 1
                      ? "overflow-hidden rounded-2xl border border-border bg-muted sm:order-2"
                      : "overflow-hidden rounded-2xl border border-border bg-muted"
                  }
                >
                  <img
                    src={m.image.src}
                    alt={m.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
                <div className={i % 2 === 1 ? "sm:order-1 sm:text-right" : ""}>
                  <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">{m.role}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                    {m.name}
                  </h3>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:inline-block">
                    {m.bio}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
