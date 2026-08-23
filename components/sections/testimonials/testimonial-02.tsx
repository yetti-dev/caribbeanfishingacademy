import { Reveal } from "@/components/magic/reveal";
import type { SectionHeading, Testimonial } from "@/content/types";

/** Masonry wall. CSS columns let the cards stagger instead of locking to a row grid. */
export function Testimonial02({ heading, testimonials }: { heading: SectionHeading; testimonials: Testimonial[] }) {
  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 text-lg leading-relaxed text-foreground/70">{heading.body}</p> : null}
        </Reveal>
        <div className="mt-14 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="break-inside-avoid rounded-2xl border border-border bg-card p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <blockquote
                className={
                  i % 3 === 0
                    ? "font-display text-xl font-semibold leading-snug tracking-tight text-foreground"
                    : "text-sm leading-relaxed text-muted-foreground"
                }
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                {t.avatar ? (
                  <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-9 rounded-full object-cover" />
                ) : (
                  <span aria-hidden className="grid size-9 place-items-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {t.name.slice(0, 1)}
                  </span>
                )}
                <span className="text-xs">
                  <span className="block font-semibold text-foreground">{t.name}</span>
                  {t.role ? <span className="block text-muted-foreground">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
