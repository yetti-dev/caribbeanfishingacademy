import { ArrowRight, ArrowUpRight, Clock, Mail } from "lucide-react";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { demoPosts, type Post } from "@/content/demo";
import type { SectionHeading } from "@/content/types";

/**
 * PAGE-BLOG-INDEX
 *
 * A magazine index. Editorial serif display type, a lead story that gets the
 * width it deserves, a category rail, a hairline grid, pagination and a
 * newsletter strip. Server component: nothing here needs state.
 */

function CategoryRail({ categories, active }: { categories: string[]; active: string }) {
  return (
    <nav aria-label="Post categories" className="border-y border-border bg-background">
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const on = c === active;
          return (
            <li key={c}>
              <a
                href={`#${c.toLowerCase().replace(/\s+/g, "-")}`}
                aria-current={on ? "page" : undefined}
                className={
                  on
                    ? "inline-block cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    : "inline-block cursor-pointer rounded-full px-4 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                }
              >
                {c}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={className}>
      <span className="font-medium text-foreground">{post.author}</span>
      <span aria-hidden className="px-2 text-border">
        /
      </span>
      {post.date}
      <span aria-hidden className="px-2 text-border">
        /
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock aria-hidden className="size-3.5" />
        {post.readingTime}
      </span>
    </p>
  );
}

export function BlogIndexPage({
  brand = "Blue Water Sail",
  heading = {
    eyebrow: "The logbook",
    title: "Notes from twelve seasons on this coast",
    body: "Wind, water clarity, the gear that survives salt, and the reasoning behind every call the captain makes. Written by the crew, not by a marketing desk.",
  },
  posts = demoPosts,
  categories,
  activeCategory = "All",
  newsletter = {
    title: "One letter a month, sent the morning the forecast turns",
    body: "Season notes, open slots before they go public, and the occasional photograph worth the scroll.",
    action: "Join the list",
  },
  pages = 4,
  currentPage = 1,
}: {
  brand?: string;
  heading?: SectionHeading;
  posts?: Post[];
  categories?: string[];
  activeCategory?: string;
  newsletter?: { title: string; body: string; action: string };
  pages?: number;
  currentPage?: number;
}) {
  const cats = categories ?? ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [lead, ...rest] = posts;

  return (
    <div id="top" className="bg-background text-foreground">
      <PageNav brand={brand} variant="editorial" cta={{ label: "Book a trip", href: "#book" }} />

      <main>
        {/* Masthead */}
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:pt-24">
          <Reveal className="max-w-4xl">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-7xl">
              {heading.title}
            </h1>
            {heading.body ? (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {heading.body}
              </p>
            ) : null}
          </Reveal>
        </section>

        <CategoryRail categories={cats} active={activeCategory} />

        {/* Lead story. Image in its own area, copy on a solid surface beside it. */}
        {lead ? (
          <section aria-labelledby="lead-story" className="mx-auto max-w-7xl px-6 py-14">
            <Reveal className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
              <a
                href="#post"
                className="group block cursor-pointer overflow-hidden rounded-2xl border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lead.image.src}
                    alt={lead.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              </a>
              <div>
                <p className="eyebrow text-primary">Lead story / {lead.category}</p>
                <h2
                  id="lead-story"
                  className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl"
                >
                  <a
                    href="#post"
                    className="cursor-pointer underline-offset-8 transition-colors duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {lead.title}
                  </a>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead.excerpt}</p>
                <PostMeta post={lead} className="mt-6 text-sm text-muted-foreground" />
                <a
                  href="#post"
                  className="group mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Read the piece
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </Reveal>
          </section>
        ) : null}

        {/* The grid, on hairlines rather than card boxes. */}
        <section aria-labelledby="more-writing" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex items-baseline justify-between gap-6">
              <h2
                id="more-writing"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                More from the logbook
              </h2>
              <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {posts.length} pieces
              </p>
            </div>

            <RevealGroup className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <RevealItem key={p.title}>
                  <article
                    className={
                      i === 0
                        ? "flex h-full flex-col md:col-span-2 md:flex-row md:gap-8 lg:col-span-2"
                        : "flex h-full flex-col"
                    }
                  >
                    <a
                      href="#post"
                      className={
                        i === 0
                          ? "group block w-full shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border md:w-1/2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          : "group block cursor-pointer overflow-hidden rounded-xl border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      }
                    >
                      <div className={i === 0 ? "aspect-[4/3] w-full" : "aspect-[3/2] w-full"}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image.src}
                          alt={p.image.alt}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                      </div>
                    </a>
                    <div className="mt-5 flex flex-1 flex-col md:mt-0">
                      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                        {p.category}
                      </p>
                      <h3
                        className={
                          i === 0
                            ? "mt-3 font-display text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl"
                            : "mt-3 font-display text-xl leading-snug font-semibold tracking-tight text-balance"
                        }
                      >
                        <a
                          href="#post"
                          className="cursor-pointer underline-offset-4 transition-colors duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {p.title}
                        </a>
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                      <PostMeta
                        post={p}
                        className="mt-auto pt-5 text-xs text-muted-foreground"
                      />
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Pagination */}
        <nav aria-label="Pagination" className="border-t border-border">
          <ul className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
              const on = n === currentPage;
              return (
                <li key={n}>
                  <a
                    href={`#page-${n}`}
                    aria-current={on ? "page" : undefined}
                    className={
                      on
                        ? "grid size-10 cursor-pointer place-items-center rounded-full bg-foreground text-sm font-semibold text-background transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "grid size-10 cursor-pointer place-items-center rounded-full border border-border text-sm text-muted-foreground transition duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    }
                  >
                    {n}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={`#page-${Math.min(currentPage + 1, pages)}`}
                className="group ml-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Next
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                />
              </a>
            </li>
          </ul>
        </nav>

        {/* Newsletter strip */}
        <section aria-labelledby="newsletter" className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <Reveal>
              <p className="eyebrow opacity-80">The dispatch</p>
              <h2
                id="newsletter"
                className="mt-3 max-w-xl font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl"
              >
                {newsletter.title}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed opacity-90">{newsletter.body}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <form className="rounded-2xl bg-card p-5 text-foreground">
                <label
                  htmlFor="blog-newsletter-email"
                  className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
                >
                  Email address
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail
                      aria-hidden
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="blog-newsletter-email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-9 text-sm text-foreground transition duration-200 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {newsletter.action}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  No sharing, no selling, one click to leave.
                </p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <PageFooter brand={brand} variant="editorial" />
    </div>
  );
}
