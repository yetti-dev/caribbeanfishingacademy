import { ArrowRight, Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** The price chip breaks the seam. A photo panel with the fare overlapping the bottom edge onto the card body. */
export function Tour03({
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
      <div className="mx-auto max-w-7xl px-6">
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

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <div className="aspect-[3/2] w-full bg-muted">
                    <img
                      src={t.image.src}
                      alt={t.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                  <p className="absolute -bottom-5 left-6 rounded-xl bg-primary px-4 py-2.5 font-display text-lg font-bold text-primary-foreground shadow-lg">
                    {t.price}
                    <span className="ml-1 text-xs font-medium opacity-80">per guest</span>
                  </p>
                  <p className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <Clock aria-hidden className="size-3.5" />
                    {t.duration}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-9">
                  <Rating rating={t.rating} reviews={t.reviews} className="text-foreground" />
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {cta?.label ?? "See the itinerary"}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
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
