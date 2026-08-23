import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Member } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/** Square portrait grid. The bio unfolds on hover and on keyboard focus. */
export function Team01({ heading, members }: { heading?: SectionHeading; members: Member[] }) {
  return (
    <section className="bg-background py-20 lg:py-28">
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

        <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <RevealItem key={m.name}>
              <article
                tabIndex={0}
                className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  <img
                    src={m.image.src}
                    alt={m.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{m.name}</h3>
                <p className="mt-1 font-mono text-xs tracking-wide text-primary">{m.role}</p>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
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
