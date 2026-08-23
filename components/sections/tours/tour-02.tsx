import { Clock, MapPin, Users } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Booking-site rows. Photo left, detail middle, a bordered price rail on the right. Stacks vertically. */
export function Tour02({
  heading,
  tours,
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  cta?: Cta;
}) {
  return (
    <section className="bg-muted/40 py-20">
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

        <RevealGroup className="mt-12 flex flex-col gap-4">
          {tours.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg sm:flex-row">
                <div className="aspect-[16/10] w-full shrink-0 bg-muted sm:aspect-auto sm:h-auto sm:w-64">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      <a
                        href="#book"
                        className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {t.title}
                      </a>
                    </h3>
                    <Rating rating={t.rating} reviews={t.reviews} className="mt-2 text-foreground" />
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <li className="inline-flex items-center gap-1.5">
                      <Clock aria-hidden className="size-3.5" />
                      {t.duration}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden className="size-3.5" />
                      {t.from}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Users aria-hidden className="size-3.5" />
                      Twelve guests maximum
                    </li>
                  </ul>
                </div>

                <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-border bg-background/60 p-6 sm:w-56 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-display text-3xl font-bold tracking-tight text-foreground">{t.price}</p>
                    <p className="text-xs text-muted-foreground">per guest, tax included</p>
                  </div>
                  <span className="relative z-10 inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-full">
                    {cta?.label ?? "Check availability"}
                  </span>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
