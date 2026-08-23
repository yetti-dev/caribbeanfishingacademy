import { Calendar, Ruler, Users } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Boat } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/**
 * Fleet 02: the whole fleet as cards, each closing with a compact three part
 * spec strip split by vertical hairlines.
 */
export function Fleet02({
  heading,
  boats,
}: {
  heading?: SectionHeading;
  boats: Boat[];
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

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {boats.map((boat) => (
            <RevealItem key={boat.name} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[5/4] overflow-hidden bg-muted">
                  <img
                    src={boat.image.src}
                    alt={boat.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="eyebrow text-primary">{boat.type}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
                    {boat.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{boat.body}</p>
                </div>

                <dl className="grid grid-cols-3 border-t border-border">
                  <div className="flex flex-col items-center gap-1 border-r border-border px-2 py-4">
                    <Ruler className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">Length</dt>
                    <dd className="font-mono text-xs text-foreground">{boat.length}</dd>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-r border-border px-2 py-4">
                    <Users className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">Guests</dt>
                    <dd className="font-mono text-xs text-foreground">{boat.guests} guests</dd>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-2 py-4">
                    <Calendar className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">In service</dt>
                    <dd className="font-mono text-xs text-foreground">{boat.year}</dd>
                  </div>
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
