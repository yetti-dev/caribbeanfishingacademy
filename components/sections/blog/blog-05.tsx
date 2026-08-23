import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, SectionHeading } from "@/content/types";
import type { Post as BlogPost } from "@/content/demo";

/**
 * Reads the month and year off the already formatted date string, so nothing
 * here constructs a Date. "12 June 2026" becomes "June 2026".
 */
function monthOf(date: string) {
  const parts = date.trim().split(/\s+/);
  return parts.length >= 2 ? parts.slice(-2).join(" ") : date;
}

function groupByMonth(posts: BlogPost[]) {
  const groups: { month: string; items: BlogPost[] }[] = [];
  for (const post of posts) {
    const month = monthOf(post.date);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.items.push(post);
    else groups.push({ month, items: [post] });
  }
  return groups;
}

/** Chronological archive. Sticky month label in the left margin, compact rows, no images. */
export function Blog05({ heading, posts, cta }: {
  heading?: SectionHeading; posts: BlogPost[]; cta?: Cta;
}) {
  const groups = groupByMonth(posts);

  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl border-b border-border pb-10">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-4">
          {groups.map((group) => (
            <div key={group.month} className="grid gap-2 py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <div className="sm:sticky sm:top-24 sm:self-start">
                <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">{group.month}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "entry" : "entries"}
                </p>
              </div>
              <ul className="divide-y divide-border border-t border-border">
                {group.items.map((post) => (
                  <li key={post.title}>
                    <article className="group relative flex flex-col gap-1 py-5 transition duration-200 ease-out hover:-translate-y-1 sm:flex-row sm:items-baseline sm:gap-6">
                      <p className="shrink-0 font-mono text-[11px] tracking-wide text-muted-foreground sm:w-14">
                        {post.date.split(/\s+/)[0]}
                      </p>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                          <a href="#post" className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                            {post.title}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                      </div>
                      <p className="shrink-0 font-mono text-[11px] tracking-wide text-muted-foreground">
                        {post.category} / {post.readingTime}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {cta ? (
          <div className="mt-6 border-t border-border pt-10">
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
