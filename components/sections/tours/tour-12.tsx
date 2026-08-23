import { ArrowUpRight, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/magic/border-beam";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Private charter, played dark. Ink surface, brand accent held at low alpha, and a travelling beam on the headline boat only. */
export function Tour12({
  heading,
  tours,
  cta,
  featuredIndex = 0,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  cta?: Cta;
  featuredIndex?: number;
}) {
  return (
    <section className="bg-foreground py-24 text-background">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? (
              <p className="eyebrow inline-flex items-center gap-2 rounded-full bg-primary/25 px-3 py-1 text-background">
                <Sparkles aria-hidden className="size-3.5" />
                {heading.eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-background/75">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
          {tours.map((t, i) => (
            <RevealItem key={t.title}>
              <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-background/15 bg-background/5 p-2 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                {i === featuredIndex ? <BorderBeam size={90} duration={9} /> : null}
                <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-background/10">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover opacity-90 transition duration-300 ease-out group-hover:opacity-100"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">{t.duration}</p>
                    <Rating
                      rating={t.rating}
                      reviews={t.reviews}
                      stars={1}
                      className="text-background/70"
                      starClassName="text-primary"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-background/70">{t.body}</p>
                  <div className="mt-7 flex items-end justify-between gap-4 border-t border-background/15 pt-5">
                    <p>
                      <span className="block text-xs text-background/60">Charter from</span>
                      <span className="font-display text-3xl font-bold tracking-tight">{t.price}</span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {cta?.label ?? "Talk to the crew"}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
