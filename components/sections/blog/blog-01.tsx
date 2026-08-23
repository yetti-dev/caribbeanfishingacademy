import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";
import type { Post as BlogPost } from "@/content/demo";

/** Featured lead post beside a hairline separated list of the next four. */
export function Blog01({ heading, posts, cta }: {
  heading?: SectionHeading; posts: BlogPost[]; cta?: Cta;
}) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  const list = rest.slice(0, 4);

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
              {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
            </div>
            {cta ? (
              <a href={cta.href} className="group inline-flex cursor-pointer items-center gap-1.5 border-b border-border pb-1 text-sm font-semibold text-foreground transition duration-200 ease-out hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                {cta.label}
                <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <article className="group relative flex flex-col transition duration-200 ease-out hover:-translate-y-1">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                <img src={lead.image.src} alt={lead.image.alt} loading="lazy" decoding="async"
                  className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="mt-6">
                <p className="eyebrow text-primary">{lead.category}</p>
                <h3 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-foreground sm:text-4xl">
                  <a href="#post" className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    {lead.title}
                  </a>
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{lead.excerpt}</p>
                <p className="mt-5 font-mono text-xs tracking-wide text-muted-foreground">
                  {lead.author} / {lead.date} / {lead.readingTime}
                </p>
              </div>
            </article>
          </Reveal>

          <RevealGroup className="divide-y divide-border border-t border-border">
            {list.map((post) => (
              <RevealItem key={post.title}>
                <article className="group relative py-6 transition duration-200 ease-out hover:-translate-y-1">
                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                    {post.category} / {post.date}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                    <a href="#post" className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{post.readingTime} read</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
