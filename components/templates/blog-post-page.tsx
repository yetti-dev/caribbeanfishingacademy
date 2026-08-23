import { ArrowLeft, ArrowUpRight, Clock, Link2, Mail } from "lucide-react";
import { FacebookIcon, LinkedInIcon } from "@/components/icons";
import { PageFooter, PageNav } from "@/components/templates/page-chrome";
import { ReadingProgress } from "@/components/templates/reading-progress";
import { Reveal } from "@/components/magic/reveal";
import { demoPostBody, demoPosts, type Post, type PostBlock } from "@/content/demo";
import type { Img } from "@/content/types";

/**
 * PAGE-BLOG-POST
 *
 * A reading experience rather than a blog layout: one measured 68ch column, a
 * sticky contents rail on xl, a progress hairline, share actions, an author
 * card and three related pieces. Only the progress bar is a client component.
 */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const shareLinks = [
  { label: "Share on Facebook", icon: FacebookIcon },
  { label: "Share on LinkedIn", icon: LinkedInIcon },
  { label: "Email this piece", icon: Mail },
  { label: "Copy link", icon: Link2 },
];

function ShareRow({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {shareLinks.map((s) => (
        <li key={s.label}>
          <a
            href="#share"
            aria-label={s.label}
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <s.icon aria-hidden className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Block({ block }: { block: PostBlock }) {
  if (block.kind === "h2") {
    return (
      <h2
        id={slug(block.text)}
        className="mt-14 scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl"
      >
        {block.text}
      </h2>
    );
  }
  if (block.kind === "p") {
    return <p className="mt-6 text-lg leading-relaxed text-foreground/90">{block.text}</p>;
  }
  if (block.kind === "list") {
    return (
      <ul className="mt-6 space-y-3 border-l-2 border-border pl-5">
        {block.items.map((it) => (
          <li key={it} className="text-lg leading-relaxed text-foreground/90">
            {it}
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "quote") {
    return (
      <blockquote className="mt-10 rounded-2xl bg-muted p-7">
        <p className="font-display text-xl leading-snug font-medium text-balance text-foreground sm:text-2xl">
          {block.text}
        </p>
        {block.author ? (
          <footer className="mt-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {block.author}
          </footer>
        ) : null}
      </blockquote>
    );
  }
  return (
    <figure className="mt-10">
      <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.image.src}
          alt={block.image.alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">{block.image.alt}</figcaption>
    </figure>
  );
}

export function BlogPostPage({
  brand = "Blue Water Sail",
  post = demoPosts[0],
  body = demoPostBody,
  hero,
  authorBio = "Master mariner and founder. Twenty two years on a commercial licence, and the one who decides at 07:00 whether the boat sails.",
  authorImage,
  related,
}: {
  brand?: string;
  post?: Post;
  body?: PostBlock[];
  hero?: Img;
  authorBio?: string;
  authorImage?: Img;
  related?: Post[];
}) {
  const heroImage = hero ?? post.image;
  const face = authorImage ?? demoPosts[3].image;
  const more = related ?? demoPosts.filter((p) => p.title !== post.title).slice(0, 3);
  const toc = body.filter((b): b is Extract<PostBlock, { kind: "h2" }> => b.kind === "h2");

  return (
    <div id="top" className="bg-background text-foreground">
      <PageNav brand={brand} variant="plain" cta={{ label: "Book a trip", href: "#book" }} />

      <main>
        <div className="relative">
          <ReadingProgress label={`Reading progress for ${post.title}`} />

          <article>
            {/* Title block */}
            <header className="mx-auto max-w-3xl px-6 pt-12 pb-10 lg:pt-16">
              <a
                href="#logbook"
                className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <ArrowLeft
                  aria-hidden
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
                />
                All of the logbook
              </a>
              <p className="eyebrow mt-8 text-primary">{post.category}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <span className="size-10 shrink-0 overflow-hidden rounded-full border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={face.src}
                      alt={`${post.author}, aboard`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {post.author}
                    </span>
                    <span className="block text-xs text-muted-foreground">{post.date}</span>
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock aria-hidden className="size-4" />
                  {post.readingTime} read
                </span>
                <ShareRow className="flex items-center gap-2 sm:ml-auto" />
              </div>
            </header>

            {/* Hero image, in its own area. No copy laid over it. */}
            <div className="mx-auto max-w-6xl px-6">
              <figure>
                <div className="aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImage.src}
                    alt={heroImage.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                  {heroImage.alt}
                </figcaption>
              </figure>
            </div>

            {/* Contents rail, article column, share rail */}
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 xl:grid-cols-[220px_minmax(0,68ch)_140px] xl:justify-center">
              <aside className="hidden xl:block" aria-label="On this page">
                <nav className="sticky top-24">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    On this page
                  </p>
                  <ul className="mt-4 space-y-3 border-l border-border">
                    {toc.map((h) => (
                      <li key={h.text}>
                        <a
                          href={`#${slug(h.text)}`}
                          className="-ml-px block cursor-pointer border-l-2 border-transparent pl-4 text-sm leading-snug text-muted-foreground transition duration-200 ease-out hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <div className="max-w-[68ch]">
                {body.map((b, i) => (
                  <Block key={`${b.kind}-${i}`} block={b} />
                ))}

                {/* Author card */}
                <aside className="mt-16 rounded-2xl border border-border bg-card p-6 sm:flex sm:items-start sm:gap-5">
                  <span className="block size-16 shrink-0 overflow-hidden rounded-full border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={face.src}
                      alt={`${post.author} at the helm`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </span>
                  <div className="mt-4 sm:mt-0">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                      Written by
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
                      {post.author}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {authorBio}
                    </p>
                    <a
                      href="#crew"
                      className="group mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      Meet the rest of the crew
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </aside>
              </div>

              <aside className="hidden xl:block" aria-label="Share this piece">
                <div className="sticky top-24">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                    Share
                  </p>
                  <ShareRow className="mt-4 flex flex-col gap-2" />
                </div>
              </aside>
            </div>
          </article>
        </div>

        {/* Related */}
        <section aria-labelledby="related" className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <Reveal>
              <h2
                id="related"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Read next
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {more.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.07}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-[3/2] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image.src}
                        alt={p.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                        {p.category}
                      </p>
                      <h3 className="mt-2 font-display text-lg leading-snug font-semibold tracking-tight">
                        <a
                          href="#post"
                          className="cursor-pointer underline-offset-4 transition-colors duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          {p.title}
                        </a>
                      </h3>
                      <p className="mt-auto pt-4 text-xs text-muted-foreground">
                        {p.date} / {p.readingTime}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter brand={brand} variant="plain" />
    </div>
  );
}
