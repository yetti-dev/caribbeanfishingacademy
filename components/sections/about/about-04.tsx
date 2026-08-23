import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img, SectionHeading } from "@/content/types";

/** Three offset photos in an asymmetric stack beside the copy. No text sits on a photo. */
export function About04({ heading, body = [], images = [], cta }: {
  heading: SectionHeading;
  body?: string[];
  images?: Img[];
  cta?: Cta;
}) {
  const [a, b, c] = images;
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <Reveal className="order-2 lg:order-1">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 max-w-md font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? (
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
          <div className="mt-6 max-w-md space-y-4">
            {body.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </div>
          {cta ? (
            <a
              href={cta.href}
              className="group mt-9 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.08}>
          <div className="relative mx-auto max-w-lg pb-16 lg:max-w-none lg:pb-24">
            {a ? (
              <figure className="w-[78%] -rotate-2 overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
                <img src={a.src} alt={a.alt} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
              </figure>
            ) : null}
            {b ? (
              <figure className="absolute top-16 right-0 w-[52%] rotate-3 overflow-hidden rounded-xl border border-border bg-muted shadow-md sm:top-24">
                <img src={b.src} alt={b.alt} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </figure>
            ) : null}
            {c ? (
              <figure className="absolute right-8 -bottom-2 w-[46%] -rotate-1 overflow-hidden rounded-xl border border-border bg-muted shadow-md sm:right-12">
                <img src={c.src} alt={c.alt} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" />
              </figure>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
