import { Clock, MapPin, Star, Users } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Two trips, one shared row grid. Every line of the comparison lands on the same baseline, and the popular one wears a ribbon. */
export function Tour15({
  heading,
  tours,
  popularIndex = 0,
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  popularIndex?: number;
  cta?: Cta;
}) {
  const pair = tours.slice(0, 2);
  if (pair.length < 2) return null;

  const rows: { label: string; icon: React.ReactNode; get: (t: TourItem) => string }[] = [
    { label: "Time on the water", icon: <Clock aria-hidden className="size-3.5" />, get: (t) => t.duration },
    { label: "Boards at", icon: <MapPin aria-hidden className="size-3.5" />, get: (t) => t.from },
    { label: "Good for", icon: <Users aria-hidden className="size-3.5" />, get: (t) => t.tags.join(", ") },
    {
      label: "Guest rating",
      icon: <Star aria-hidden className="size-3.5" />,
      get: (t) => `${t.rating.toFixed(1)} out of 5 from ${t.reviews} reviews`,
    },
  ];

  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-5xl px-6">
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

        <Reveal className="mt-14 grid gap-6 sm:grid-cols-2">
          {pair.map((t, i) => (
            <article
              key={t.title}
              className={cn(
                "group relative flex cursor-pointer flex-col rounded-3xl border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
                i === popularIndex ? "border-primary shadow-sm" : "border-border",
              )}
            >
              {i === popularIndex ? (
                <p className="absolute -top-3 left-6 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  Most booked
                </p>
              ) : null}

              <div className="aspect-[16/10] w-full overflow-hidden rounded-t-3xl bg-muted">
                <img
                  src={t.image.src}
                  alt={t.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="min-h-14 font-display text-2xl font-bold tracking-tight text-balance text-foreground">
                  <a
                    href="#book"
                    className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {t.title}
                  </a>
                </h3>
                <p className="mt-2 min-h-16 text-sm leading-relaxed text-muted-foreground">{t.body}</p>

                <p className="mt-5 flex items-baseline gap-2 border-t border-border pt-5">
                  <span className="font-display text-4xl font-bold tracking-tight text-foreground">{t.price}</span>
                  <span className="text-sm text-muted-foreground">per guest</span>
                </p>

                <dl className="mt-5 divide-y divide-border border-t border-border text-sm">
                  {rows.map((row) => (
                    <div key={row.label} className="grid min-h-20 grid-rows-[auto_1fr] gap-1 py-4">
                      <dt className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        {row.icon}
                        {row.label}
                      </dt>
                      <dd className="font-medium text-foreground">{row.get(t)}</dd>
                    </div>
                  ))}
                </dl>

                <span
                  className={cn(
                    "relative z-10 mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-lg",
                    i === popularIndex
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground",
                  )}
                >
                  {cta?.label ?? "Check availability"}
                </span>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
