import { Reveal } from "@/components/magic/reveal";
import type { Boat } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/**
 * Fleet 04: sticky scroll. The lead photo pins on the left from lg up while
 * the boat spec blocks run past on the right. Below lg it stacks plainly.
 */
export function Fleet04({
  heading,
  boats,
  cta,
}: {
  heading?: SectionHeading;
  boats: Boat[];
  cta?: Cta;
}) {
  const lead = boats[0];

  return (
    <section className="border-b border-border bg-accent py-24 text-accent-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            {heading ? (
              <div className="max-w-md">
                {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-accent-foreground sm:text-5xl">
                  {heading.title}
                </h2>
                {heading.body ? (
                  <p className="mt-4 text-lg leading-relaxed text-accent-foreground/80">{heading.body}</p>
                ) : null}
              </div>
            ) : null}

            {lead ? (
              <div className="mt-8 aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={lead.image.src}
                  alt={lead.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            ) : null}

            {cta ? (
              <a
                href={cta.href}
                className="mt-6 inline-flex cursor-pointer items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {cta.label}
              </a>
            ) : null}
          </div>

          <div className="space-y-8">
            {boats.map((boat, i) => (
              <Reveal key={boat.name}>
                <article className="rounded-2xl border border-border bg-card p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow text-primary">{boat.type}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-card-foreground">
                    {boat.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{boat.body}</p>

                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
                    {boat.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 font-display text-base font-semibold text-card-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
