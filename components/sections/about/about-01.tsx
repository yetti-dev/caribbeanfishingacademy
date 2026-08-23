import { Reveal } from "@/components/magic/reveal";
import type { Img, SectionHeading } from "@/content/types";

/** Measured single column, oversized drop cap, one wide photo breaking the measure. */
export function About01({ heading, body = [], image, caption }: {
  heading: SectionHeading;
  body?: string[];
  image?: Img;
  caption?: string;
}) {
  const [first, ...rest] = body;
  const half = Math.ceil(rest.length / 2);
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-6 border-l-2 border-primary pl-5 text-lg leading-relaxed text-muted-foreground">
              {heading.body}
            </p>
          ) : null}
        </Reveal>

        {first ? (
          <Reveal className="mx-auto mt-12 max-w-2xl" delay={0.05}>
            <p className="text-lg leading-relaxed text-foreground first-letter:mr-3 first-letter:float-left first-letter:font-display first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary sm:first-letter:text-8xl">
              {first}
            </p>
          </Reveal>
        ) : null}

        {rest.slice(0, half).map((p, i) => (
          <Reveal key={p.slice(0, 24)} className="mx-auto mt-6 max-w-2xl" delay={0.05 + i * 0.03}>
            <p className="text-lg leading-relaxed text-muted-foreground">{p}</p>
          </Reveal>
        ))}

        {image ? (
          <Reveal className="mt-14" delay={0.1}>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
              {caption ? (
                <figcaption className="mx-auto mt-3 max-w-2xl font-mono text-xs tracking-wide text-muted-foreground">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ) : null}

        {rest.slice(half).map((p, i) => (
          <Reveal key={p.slice(0, 24)} className="mx-auto mt-6 max-w-2xl first:mt-14" delay={0.05 + i * 0.03}>
            <p className="text-lg leading-relaxed text-muted-foreground">{p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
