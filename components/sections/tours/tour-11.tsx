import { Anchor, Clock } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Rating } from "@/components/sections/tours/rating";
import type { Tour as TourItem } from "@/content/demo";
import type { Cta, SectionHeading } from "@/content/types";

/** Ticket stubs. Punched notches, a dashed tear line between the trip and the fare, and a mono booking reference. */
export function Tour11({
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

        <RevealGroup className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2">
          {tours.map((t, i) => {
            const ref = `${t.title
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()}-${String(i + 1).padStart(3, "0")}`;
            return (
              <RevealItem key={t.title}>
                <article className="group relative cursor-pointer rounded-2xl border border-border bg-card shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex gap-5 p-6">
                    <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img
                        src={t.image.src}
                        alt={t.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                        Ref {ref}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground">
                        <a
                          href="#book"
                          className="after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {t.title}
                        </a>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border border-border bg-muted/40"
                    />
                    <span
                      aria-hidden
                      className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border border-border bg-muted/40"
                    />
                    <span aria-hidden className="mx-6 block border-t border-dashed border-border" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="inline-flex items-center gap-1.5">
                        <Clock aria-hidden className="size-3.5" />
                        {t.duration}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Anchor aria-hidden className="size-3.5" />
                        Boards at {t.from}
                      </li>
                      <li>
                        <Rating rating={t.rating} reviews={t.reviews} className="text-muted-foreground" />
                      </li>
                    </ul>
                    <p className="text-right">
                      <span className="block font-mono text-3xl font-bold tabular-nums text-foreground">{t.price}</span>
                      <span className="text-xs text-muted-foreground">per guest, all in</span>
                    </p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {cta ? (
          <Reveal className="mt-12 text-center">
            <a
              href={cta.href}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {cta.label}
            </a>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
