import { Calendar, Check, MessageCircle, Ruler, Users } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { BookButton } from "@/components/widget/book-button";
import type { Boat } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/**
 * Fleet 02: the whole fleet as cards. A quick-glance icon strip (length,
 * guests, in service) up top, the full spec sheet below it, then a real
 * booking button, so a card carries everything needed to decide and act.
 */
export function Fleet02({
  heading,
  boats,
  activityId = "",
  bookLabel = "Book This Trip",
}: {
  heading?: SectionHeading;
  boats: Boat[];
  /** Yetti activity ID the booking button opens. Every boat here shares one trip. */
  activityId?: string;
  bookLabel?: string;
}) {
  return (
    <section className="border-b border-border bg-muted py-24">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? (
              <p className="mt-4 text-lg leading-relaxed text-foreground/70">{heading.body}</p>
            ) : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2">
          {boats.map((boat) => (
            <RevealItem key={boat.name} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-24px_rgba(0,0,0,0.28)]">
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  <img
                    src={boat.image.src}
                    alt={boat.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="eyebrow absolute top-4 left-4 inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-white shadow-md backdrop-blur-sm">
                    {boat.type}
                  </span>
                </div>

                <div className="flex flex-col p-7">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {boat.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{boat.body}</p>

                  <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                        <Ruler className="size-4" aria-hidden="true" />
                      </span>
                      <dt className="sr-only">Length</dt>
                      <dd className="font-mono text-xs font-medium text-foreground">{boat.length}</dd>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                        <Users className="size-4" aria-hidden="true" />
                      </span>
                      <dt className="sr-only">Guests</dt>
                      <dd className="font-mono text-xs font-medium text-foreground">{boat.guests} guests</dd>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                        <Calendar className="size-4" aria-hidden="true" />
                      </span>
                      <dt className="sr-only">In service</dt>
                      <dd className="font-mono text-xs font-medium text-foreground">{boat.year}</dd>
                    </div>
                  </dl>

                  {boat.specs.length ? (
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border pt-5">
                      {boat.specs.map((s) => (
                        <div key={s.label} className="flex items-start gap-2">
                          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div>
                            <dt className="text-xs text-muted-foreground">{s.label}</dt>
                            <dd className="text-sm font-medium text-foreground">{s.value}</dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <BookButton
                    activityId={activityId}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <MessageCircle aria-hidden className="size-4" />
                    {bookLabel}
                  </BookButton>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
