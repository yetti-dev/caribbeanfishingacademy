import { Reveal } from "@/components/magic/reveal";
import { AutoSlider } from "@/components/magic/auto-slider";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Tall poster cards on an auto advancing rail. Portrait photo up top, copy on a solid surface below, never text on the image. */
export function Tour08({
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
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
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
                className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {cta.label}
              </a>
            ) : null}
          </Reveal>
        ) : null}

        <Reveal className="mt-12">
          <AutoSlider itemClassName="w-[78%] sm:w-[44%] lg:w-[27%]" interval={4200}>
            {tours.map((t) => (
              <article
                key={t.title}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[3/4] w-full bg-muted">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-primary">{t.duration}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-xl font-bold tracking-tight text-foreground">{t.price}</span>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} className="text-muted-foreground" />
                  </div>
                </div>
              </article>
            ))}
          </AutoSlider>
        </Reveal>
      </div>
    </section>
  );
}
