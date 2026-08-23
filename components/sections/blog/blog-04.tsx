import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";
import type { Post as BlogPost } from "@/content/demo";

const meta = "font-mono text-[11px] tracking-wide text-muted-foreground";
const stretch =
  "cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none";
const card =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg";

/** Magazine bento. Five posts at three sizes, deliberately off grid. */
export function Blog04({ heading, posts, cta }: {
  heading?: SectionHeading; posts: BlogPost[]; cta?: Cta;
}) {
  const [a, b, c, d, e] = posts;
  if (!a) return null;

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-12">
          <RevealItem className="lg:col-span-7">
            <article className={card}>
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={a.image.src} alt={a.image.alt} loading="lazy" decoding="async"
                  className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="p-7 lg:p-9">
                <p className="eyebrow text-primary">{a.category}</p>
                <h3 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-foreground">
                  <a href="#post" className={stretch}>{a.title}</a>
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{a.excerpt}</p>
                <p className={`mt-5 ${meta}`}>{a.author} / {a.date} / {a.readingTime}</p>
              </div>
            </article>
          </RevealItem>

          {b ? (
            <RevealItem className="lg:col-span-5">
              <article className={`${card} h-full`}>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={b.image.src} alt={b.image.alt} loading="lazy" decoding="async"
                    className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-primary">{b.category}</p>
                  <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
                    <a href="#post" className={stretch}>{b.title}</a>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{b.excerpt}</p>
                  <p className={`mt-4 ${meta}`}>{b.date} / {b.readingTime}</p>
                </div>
              </article>
            </RevealItem>
          ) : null}

          {c ? (
            <RevealItem className="lg:col-span-5">
              <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-border bg-muted/50 p-7 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/40">
                <div>
                  <p className={meta}>{c.category}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-balance text-foreground">
                    <a href="#post" className={stretch}>{c.title}</a>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">{c.excerpt}</p>
                </div>
                <p className="mt-8 text-sm font-medium text-foreground">{c.author}, {c.date}</p>
              </article>
            </RevealItem>
          ) : null}

          {d ? (
            <RevealItem className="lg:col-span-7">
              <article className="group relative grid h-full overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg sm:grid-cols-[minmax(0,14rem)_1fr]">
                <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-auto sm:h-full">
                  <img src={d.image.src} alt={d.image.alt} loading="lazy" decoding="async"
                    className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <p className={meta}>{d.category}</p>
                  <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
                    <a href="#post" className={stretch}>{d.title}</a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.excerpt}</p>
                  <p className={`mt-4 ${meta}`}>{d.date} / {d.readingTime}</p>
                </div>
              </article>
            </RevealItem>
          ) : null}

          {e ? (
            <RevealItem className="lg:col-span-12">
              <article className="group relative flex flex-col gap-5 rounded-2xl bg-primary p-8 text-primary-foreground transition duration-200 ease-out hover:-translate-y-1 lg:flex-row lg:items-end lg:justify-between lg:p-10">
                <div className="max-w-2xl">
                  <p className="eyebrow opacity-80">{e.category}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-balance lg:text-3xl">
                    <a href="#post" className="cursor-pointer rounded-sm after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none">
                      {e.title}
                    </a>
                  </h3>
                  <p className="mt-3 text-base leading-relaxed opacity-90">{e.excerpt}</p>
                </div>
                <p className="shrink-0 font-mono text-[11px] tracking-wide opacity-80">{e.date} / {e.readingTime}</p>
              </article>
            </RevealItem>
          ) : null}
        </RevealGroup>

        {cta ? (
          <div className="mt-12">
            <a href={cta.href} className="group inline-flex cursor-pointer items-center gap-1.5 border-b border-border pb-1 text-sm font-semibold text-foreground transition duration-200 ease-out hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
