import { Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Img, SectionHeading } from "@/content/types";

/** Alternating image and text rows. The workhorse layout. */
export function Feature03({ heading, rows }: {
  heading?: SectionHeading;
  rows: { title: string; body: string; image: Img; bullets?: string[] }[];
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-16 space-y-20">
          {rows.map((row, i) => (
            <Reveal key={row.title}>
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <img
                  src={row.image.src} alt={row.image.alt} loading="lazy" decoding="async"
                  className={`aspect-4/3 w-full rounded-2xl border border-border object-cover ${i % 2 ? "lg:order-2" : ""}`}
                />
                <div className={i % 2 ? "lg:order-1" : ""}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground">{row.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{row.body}</p>
                  {row.bullets?.length ? (
                    <ul className="mt-6 space-y-2.5">
                      {row.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
