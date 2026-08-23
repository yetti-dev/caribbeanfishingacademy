import { Quote as QuoteIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { SectionHeading, Testimonial } from "@/content/types";

/** Bento. One tall featured quote with a photo, four smaller cells packed around it. */
export function Testimonial10({
  heading,
  featured,
  testimonials,
}: {
  heading: SectionHeading;
  featured: Testimonial;
  testimonials: Testimonial[];
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>
        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          <RevealItem className="lg:row-span-2">
            <figure className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
              {featured.avatar ? (
                <img
                  src={featured.avatar.src}
                  alt={featured.avatar.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-7">
                <QuoteIcon aria-hidden className="size-6 text-primary" />
                <blockquote className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-balance text-foreground">
                  {featured.quote}
                </blockquote>
                <figcaption className="mt-auto pt-6 text-sm">
                  <span className="block font-semibold text-foreground">{featured.name}</span>
                  {featured.role ? <span className="block text-muted-foreground">{featured.role}</span> : null}
                </figcaption>
              </div>
            </figure>
          </RevealItem>
          {testimonials.slice(0, 4).map((t) => (
            <RevealItem key={t.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                <blockquote className="text-base leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto flex items-center gap-2.5 pt-5 text-xs">
                  {t.avatar ? (
                    <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-8 rounded-full object-cover" />
                  ) : null}
                  <span>
                    <span className="block font-semibold text-foreground">{t.name}</span>
                    {t.role ? <span className="block text-muted-foreground">{t.role}</span> : null}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
