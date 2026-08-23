import { Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, PriceTier, SectionHeading } from "@/content/types";

/** Classic three up pricing. The featured tier scales up, sits on the brand colour, and carries the ticked list. */
export function Tour04({
  heading,
  tiers,
  cta,
}: {
  heading?: SectionHeading;
  tiers: PriceTier[];
  cta?: Cta;
}) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-16 grid items-center gap-6 lg:grid-cols-3">
          {tiers.map((tier) =>
            tier.featured ? (
              <RevealItem key={tier.name} className="lg:-my-6 lg:scale-[1.04]">
                <div className="relative flex h-full flex-col rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg transition duration-200 ease-out hover:-translate-y-1">
                  <p className="eyebrow opacity-80">Most booked</p>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{tier.name}</h3>
                  {tier.body ? <p className="mt-2 text-sm leading-relaxed opacity-85">{tier.body}</p> : null}
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold tracking-tight">{tier.price}</span>
                    {tier.period ? <span className="text-sm opacity-80">{tier.period}</span> : null}
                  </p>
                  <ul className="mt-7 flex-1 space-y-3 border-t border-primary-foreground/25 pt-7 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                        <span className="opacity-95">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.cta?.href ?? cta?.href ?? "#book"}
                    className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                  >
                    {tier.cta?.label ?? cta?.label ?? "Book this trip"}
                  </a>
                </div>
              </RevealItem>
            ) : (
              <RevealItem key={tier.name}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">{tier.name}</h3>
                  {tier.body ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tier.body}</p>
                  ) : null}
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight text-foreground">{tier.price}</span>
                    {tier.period ? <span className="text-sm text-muted-foreground">{tier.period}</span> : null}
                  </p>
                  <ul className="mt-7 flex-1 space-y-3 border-t border-border pt-7 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.cta?.href ?? cta?.href ?? "#book"}
                    className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {tier.cta?.label ?? cta?.label ?? "Book this trip"}
                  </a>
                </div>
              </RevealItem>
            ),
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
