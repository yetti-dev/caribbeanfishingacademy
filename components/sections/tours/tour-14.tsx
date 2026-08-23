import { ExternalLink, MapPin } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Map on one side, trips on the other. The panel sticks while the compact list scrolls past it. */
export function Tour14({
  heading,
  tours,
  mapQuery,
  bbox = "-70.0470,12.5090,-70.0290,12.5250",
  marker = "12.5170,-70.0380",
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  mapQuery: string;
  bbox?: string;
  marker?: string;
  cta?: Cta;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(marker)}`;
  const link = `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery)}`;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="aspect-[4/3] w-full bg-muted">
                <iframe
                  title={`Map showing ${mapQuery}`}
                  src={src}
                  loading="lazy"
                  className="size-full border-0"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-5">
                <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                  {mapQuery}
                </p>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Open the map
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
              </div>
            </div>
          </div>

          <RevealGroup className="flex flex-col gap-3">
            {tours.map((t) => (
              <RevealItem key={t.title}>
                <article className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-transparent bg-card p-3 transition duration-200 ease-out hover:-translate-y-1 hover:border-border hover:shadow-lg">
                  <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={t.image.src}
                      alt={t.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-semibold tracking-tight text-foreground">
                      <a
                        href="#book"
                        className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {t.title}
                      </a>
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {t.duration}, boards at {t.from}
                    </p>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} className="mt-1.5 text-muted-foreground" />
                  </div>
                  <p className="shrink-0 pr-1 text-right">
                    <span className="block font-display text-lg font-bold tracking-tight text-foreground">
                      {t.price}
                    </span>
                    <span className="text-[0.7rem] text-muted-foreground">per guest</span>
                  </p>
                </article>
              </RevealItem>
            ))}
            {cta ? (
              <a
                href={cta.href}
                className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {cta.label}
              </a>
            ) : null}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
