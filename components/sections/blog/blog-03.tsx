import { ArrowUpRight } from "lucide-react";
import { AutoSlider } from "@/components/magic/auto-slider";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";
import type { Post as BlogPost } from "@/content/demo";

/** Poster shaped posts on a horizontal auto slider. Tall image, text on a solid plate below. */
export function Blog03({ heading, posts, cta }: {
  heading?: SectionHeading; posts: BlogPost[]; cta?: Cta;
}) {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
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
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6">
        <AutoSlider itemClassName="w-[78%] sm:w-[44%] lg:w-[29%]" interval={4200}>
          {posts.map((post, i) => (
            <article key={post.title} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img src={post.image.src} alt={post.image.alt} loading="lazy" decoding="async"
                  className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col border-t border-border p-6">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} / {post.category}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
                  <a href="#post" className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="mt-5 text-xs text-muted-foreground">{post.date} / {post.readingTime}</p>
              </div>
            </article>
          ))}
        </AutoSlider>
      </div>
    </section>
  );
}
