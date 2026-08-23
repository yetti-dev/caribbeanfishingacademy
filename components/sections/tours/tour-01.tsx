import { Heart } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Marketplace grid. Rounded photo, floating save button, one inline star, price on its own line. Minimal chrome, four up. */
export function Tour01({
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
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
              {heading.body ? (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
              ) : null}
            </div>
            {cta ? (
              <a
                href={cta.href}
                className="cursor-pointer rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {cta.label}
              </a>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative cursor-pointer transition duration-200 ease-out hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="aspect-[4/5] w-full bg-muted">
                    <img
                      src={t.image.src}
                      alt={t.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Save ${t.title} to your shortlist`}
                    className="absolute right-3 top-3 z-10 grid size-9 cursor-pointer place-items-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-card hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Heart aria-hidden className="size-4" />
                  </button>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                      <a
                        href="#book"
                        className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {t.title}
                      </a>
                    </h3>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} showReviews={false} className="shrink-0 pt-0.5" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.duration}, departs {t.from}
                  </p>
                  <p className="mt-2.5 text-base font-bold text-foreground">
                    {t.price}{" "}
                    <span className="text-sm font-normal text-muted-foreground">per guest</span>
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
