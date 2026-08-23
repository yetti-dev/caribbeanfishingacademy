import { Clock, MapPin, Users } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Stacked info cards closed off by a three cell spec strip: hours, departure point, group size, split by hairlines. */
export function Tour09({
  heading,
  tours,
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  cta?: Cta;
}) {
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

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {tours.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-[16/9] w-full bg-muted">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      <a
                        href="#book"
                        className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {t.title}
                      </a>
                    </h3>
                    <p className="shrink-0 text-right">
                      <span className="block font-display text-2xl font-bold tracking-tight text-foreground">
                        {t.price}
                      </span>
                      <span className="text-xs text-muted-foreground">per guest</span>
                    </p>
                  </div>
                  <Rating rating={t.rating} reviews={t.reviews} className="mt-2 text-foreground" />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                </div>

                <dl className="grid grid-cols-3 divide-x divide-border border-t border-border bg-muted/30 text-center">
                  <div className="px-3 py-4">
                    <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Clock aria-hidden className="size-3.5" />
                      Duration
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{t.duration}</dd>
                  </div>
                  <div className="px-3 py-4">
                    <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin aria-hidden className="size-3.5" />
                      Departs
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{t.from}</dd>
                  </div>
                  <div className="px-3 py-4">
                    <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Users aria-hidden className="size-3.5" />
                      Guests
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">Twelve max</dd>
                  </div>
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta ? (
          <Reveal className="mt-12 text-center">
            <a
              href={cta.href}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
