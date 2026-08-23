import { ArrowUpRight, Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Bento. One hero trip takes half the grid with a full bleed photo, three smaller cells fill the rest. */
export function Tour06({
  heading,
  tours,
  cta,
}: {
  heading?: SectionHeading;
  tours: TourItem[];
  cta?: Cta;
}) {
  const [lead, ...rest] = tours;
  const small = rest.slice(0, 3);
  if (!lead) return null;

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

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-2">
          <RevealItem className="lg:row-span-3">
            <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] w-full bg-muted lg:aspect-auto lg:flex-1">
                <img
                  src={lead.image.src}
                  alt={lead.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Guest favourite
                  </span>
                  <Rating rating={lead.rating} reviews={lead.reviews} className="text-foreground" />
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-foreground">
                  <a
                    href="#book"
                    className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {lead.title}
                  </a>
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{lead.body}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground">{lead.price}</span>
                  <span className="text-sm text-muted-foreground">per guest, {lead.duration}</span>
                </p>
              </div>
            </article>
          </RevealItem>

          {small.map((t) => (
            <RevealItem key={t.title}>
              <article className="group relative flex cursor-pointer items-center gap-5 overflow-hidden rounded-2xl border border-border bg-card p-4 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-36">
                  <img
                    src={t.image.src}
                    alt={t.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock aria-hidden className="size-3.5" />
                    {t.duration}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-foreground">
                    <a
                      href="#book"
                      className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {t.title}
                    </a>
                  </h3>
                  <p className="mt-2 flex items-center gap-3">
                    <span className="font-display text-xl font-bold tracking-tight text-foreground">{t.price}</span>
                    <Rating rating={t.rating} reviews={t.reviews} stars={1} className="text-muted-foreground" />
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {cta ? (
          <Reveal className="mt-10">
            <a
              href={cta.href}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
