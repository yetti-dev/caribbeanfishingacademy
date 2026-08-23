import { Reveal } from "@/components/magic/reveal";
import type { Boat } from "@/content/demo";
import type { SectionHeading } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Fleet 01: brochure spec sheet. One boat per spread: a large photo panel on
 * one side, a hairline spec table with mono labels on the other. Sides alternate.
 */
export function Fleet01({
  heading,
  boats,
  note,
}: {
  heading?: SectionHeading;
  boats: Boat[];
  note?: string;
}) {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <div className="mt-16 space-y-20">
          {boats.map((boat, i) => (
            <Reveal key={boat.name}>
              <article className="grid items-center gap-10 lg:grid-cols-12">
                <div className={cn("lg:col-span-7", i % 2 === 1 && "lg:order-2")}>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={boat.image.src}
                      alt={boat.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                </div>

                <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-1")}>
                  <p className="eyebrow text-muted-foreground">{boat.type}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {boat.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{boat.body}</p>

                  <dl className="mt-8 border-t border-border">
                    {boat.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-baseline justify-between gap-6 border-b border-border py-3"
                      >
                        <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="font-display text-lg font-semibold text-foreground">{spec.value}</dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-6 border-b border-border py-3">
                      <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        In service
                      </dt>
                      <dd className="font-display text-lg font-semibold text-foreground">{boat.year}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {note ? (
          <Reveal className="mt-16 border-t border-border pt-6">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{note}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
