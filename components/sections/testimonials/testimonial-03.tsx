import { Marquee } from "@/components/magic/marquee";
import { Reveal } from "@/components/magic/reveal";
import type { SectionHeading, Testimonial } from "@/content/types";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-full rounded-xl border border-border bg-card p-5">
      <blockquote className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5">
        {t.avatar ? (
          <img src={t.avatar.src} alt={t.avatar.alt} loading="lazy" decoding="async" className="size-8 rounded-full object-cover" />
        ) : null}
        <span className="text-xs">
          <span className="block font-semibold text-foreground">{t.name}</span>
          {t.role ? <span className="block text-muted-foreground">{t.role}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

/** Two vertical marquee columns running in opposite directions beside a fixed heading. */
export function Testimonial03({ heading, testimonials }: { heading: SectionHeading; testimonials: Testimonial[] }) {
  const half = Math.ceil(testimonials.length / 2);
  const left = testimonials.slice(0, half);
  const right = testimonials.slice(half);
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
          {heading.body ? <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>
        <div className="relative grid h-[520px] grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2">
          <Marquee vertical pauseOnHover className="[--marquee-duration:34s] [--marquee-gap:1.5rem]">
            {left.map((t) => <Card key={t.name} t={t} />)}
          </Marquee>
          <Marquee vertical reverse pauseOnHover className="hidden [--marquee-duration:40s] [--marquee-gap:1.5rem] sm:flex">
            {right.map((t) => <Card key={t.name} t={t} />)}
          </Marquee>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
