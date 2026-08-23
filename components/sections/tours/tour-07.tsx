import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Editorial index. No cards at all: hairline rows, oversized numerals, a stamp sized thumbnail, fare set right in mono. */
export function Tour07({
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
      <div className="mx-auto max-w-5xl px-6">
        {heading ? (
          <Reveal className="border-b border-border pb-10">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup>
          {tours.map((t, i) => (
            <RevealItem key={t.title}>
              <article className="group relative grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 border-b border-border py-7 transition duration-200 ease-out hover:-translate-y-1 sm:grid-cols-[auto_auto_1fr_auto] sm:gap-x-8">
                <span
                  aria-hidden
                  className="font-mono text-3xl font-light tabular-nums text-muted-foreground/50 transition-colors duration-200 ease-out group-hover:text-primary sm:text-4xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="hidden aspect-[4/3] w-24 overflow-hidden rounded-lg bg-muted sm:block">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{t.duration}</span>
                    <span aria-hidden className="text-border">/</span>
                    <span>Departs {t.from}</span>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} className="text-muted-foreground" />
                  </p>
                </div>

                <p className="text-right">
                  <span className="block font-mono text-lg font-semibold tabular-nums text-foreground sm:text-xl">
                    {t.price}
                  </span>
                  <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">per guest</span>
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta ? (
          <Reveal className="mt-10">
            <a
              href={cta.href}
              className="group inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
