"use client";

import * as React from "react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/magic/reveal";
import { BlogCard01 } from "@/components/sections/blog/blog-card-01";
import type { Cta, SectionHeading } from "@/content/types";
import type { Post as BlogPost } from "@/content/demo";

/** Three-up grid with a live category filter row, a running count and an empty state. */
export function Blog02({ heading, posts, cta, allLabel = "Everything" }: {
  heading?: SectionHeading; posts: BlogPost[]; cta?: Cta; allLabel?: string;
}) {
  const categories = React.useMemo(
    () => [allLabel, ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts, allLabel],
  );
  const [active, setActive] = React.useState(allLabel);
  const shown = active === allLabel ? posts : posts.filter((p) => p.category === active);

  return (
    <section className="border-b border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="max-w-2xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setActive(c)} aria-pressed={active === c}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary",
              )}>
              {c}
            </button>
          ))}
          <p aria-live="polite" className="ml-auto font-mono text-xs tracking-wide text-foreground">
            {shown.length} {shown.length === 1 ? "story" : "stories"}
          </p>
        </div>

        {shown.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((post) => <BlogCard01 key={post.title} post={post} />)}
          </div>
        ) : (
          <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <SearchX aria-hidden className="size-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">Nothing filed under {active} yet</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We write these between charters, so some categories run thin. Try another topic.
            </p>
            <button type="button" onClick={() => setActive(allLabel)}
              className="mt-6 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
              Show everything
            </button>
          </div>
        )}

        {cta ? (
          <div className="mt-12 flex justify-center">
            <a href={cta.href} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
