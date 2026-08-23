import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, PriceTier, SectionHeading } from "@/content/types";

/** Every trip side by side. One row per inclusion, one column per fare, header row sticks while you scroll. */
export function Tour05({
  heading,
  tiers,
  cta,
}: {
  heading?: SectionHeading;
  tiers: PriceTier[];
  cta?: Cta;
}) {
  const rows: string[] = [];
  for (const tier of tiers) {
    for (const f of tier.features) if (!rows.includes(f)) rows.push(f);
  }

  return (
    <section className="bg-background py-20">
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

        <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <caption className="sr-only">
              What is included on each trip, compared fare by fare
            </caption>
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-b border-border">
                <th scope="col" className="w-1/3 p-5 align-bottom">
                  <span className="eyebrow text-muted-foreground">What is aboard</span>
                </th>
                {tiers.map((tier) => (
                  <th key={tier.name} scope="col" className="p-5 align-bottom">
                    <span className="block font-display text-lg font-semibold tracking-tight text-foreground">
                      {tier.name}
                    </span>
                    <span className="mt-1 block font-display text-2xl font-bold tracking-tight text-primary">
                      {tier.price}
                    </span>
                    {tier.period ? (
                      <span className="block text-xs text-muted-foreground">{tier.period}</span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row} className={i % 2 === 1 ? "bg-muted/30" : undefined}>
                  <th scope="row" className="border-t border-border p-5 text-sm font-medium text-foreground">
                    {row}
                  </th>
                  {tiers.map((tier) => {
                    const has = tier.features.includes(row);
                    return (
                      <td key={tier.name} className="border-t border-border p-5">
                        {has ? (
                          <>
                            <Check aria-hidden className="size-5 text-primary" />
                            <span className="sr-only">Included on {tier.name}</span>
                          </>
                        ) : (
                          <>
                            <Minus aria-hidden className="size-5 text-muted-foreground/50" />
                            <span className="sr-only">Not included on {tier.name}</span>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="border-t border-border p-5" />
                {tiers.map((tier) => (
                  <td key={tier.name} className="border-t border-border p-5">
                    <a
                      href={tier.cta?.href ?? cta?.href ?? "#book"}
                      className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {tier.cta?.label ?? cta?.label ?? "Book"}
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
