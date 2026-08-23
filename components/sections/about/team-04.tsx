import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Member } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/** Overlapping rotated cards on a colour band. Each straightens on hover or focus. */
const TILT = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

export function Team04({ heading, members }: { heading?: SectionHeading; members: Member[] }) {
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow opacity-75">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {heading.title}
            </h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed opacity-90">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <Reveal delay={0.08} className="mt-16 flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-0">
          {members.map((m, i) => (
            <article
              key={m.name}
              tabIndex={0}
              className={cn(
                "group w-full max-w-xs rounded-2xl border border-border bg-card p-4 text-foreground shadow-lg outline-none transition duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:rotate-0 focus-visible:z-10 focus-visible:-translate-y-2 focus-visible:rotate-0 focus-visible:ring-2 focus-visible:ring-primary-foreground lg:-ml-10 lg:first:ml-0",
                TILT[i % TILT.length],
              )}
            >
              <div className="overflow-hidden rounded-xl bg-muted">
                <img
                  src={m.image.src}
                  alt={m.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{m.name}</h3>
              <p className="mt-0.5 font-mono text-xs tracking-wide text-primary">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
