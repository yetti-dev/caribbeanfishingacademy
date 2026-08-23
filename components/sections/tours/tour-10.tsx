import { Check, Plus } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Quiet until you reach for it. Hover or keyboard focus lifts the card and rolls out the what is included list. */
export function Tour10({
  heading,
  tours,
  included = ["Masks, fins and vests in every size", "Lunch cooked on the back deck", "Cold drinks and shade all day", "Free rebooking if the captain calls it off"],
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  included?: string[];
  cta?: Cta;
}) {
  return (
    <section className="bg-muted/40 py-20">
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

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg">
                <div className="aspect-[5/3] w-full bg-muted">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>

                  <div className="grid grid-rows-[0fr] transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Plus aria-hidden className="size-3.5 text-primary" />
                        What is included
                      </p>
                      <ul className="mt-2.5 space-y-2 text-sm">
                        {included.map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <span className="font-display text-2xl font-bold tracking-tight text-foreground">{t.price}</span>
                    <Rating rating={t.rating} reviews={t.reviews} className="text-muted-foreground" />
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta ? (
          <Reveal className="mt-10 text-center">
            <a
              href={cta.href}
              className="inline-flex cursor-pointer items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
