import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Blog01 } from "@/components/sections/blog/blog-01";
import { Blog02 } from "@/components/sections/blog/blog-02";
import { Blog03 } from "@/components/sections/blog/blog-03";
import { Blog04 } from "@/components/sections/blog/blog-04";
import { Blog05 } from "@/components/sections/blog/blog-05";
import { BlogCard01 } from "@/components/sections/blog/blog-card-01";
import { BlogCard02 } from "@/components/sections/blog/blog-card-02";
import { BlogCard03 } from "@/components/sections/blog/blog-card-03";
import { BlogCard04 } from "@/components/sections/blog/blog-card-04";
import { BlogCard05 } from "@/components/sections/blog/blog-card-05";
import { demoPosts } from "@/content/demo";

const three = demoPosts.slice(0, 3);
const cardProps = "post: Post, href?: string, className?: string";

export const BLOG_ENTRIES: CatalogEntry[] = [
  /* ---------------------------------------------------------------- cards */
  {
    code: "BCARD-01", category: "Blog cards",
    label: "Classic vertical card. Image on top, category chip, excerpt, a date and reading time meta row.",
    file: "components/sections/blog/blog-card-01.tsx", component: "BlogCard01", props: cardProps,
    node: (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {three.map((post) => <BlogCard01 key={post.title} post={post} />)}
        </div>
      </div>
    ),
  },
  {
    code: "BCARD-02", category: "Blog cards",
    label: "Horizontal compact card. Square thumb left, mono meta line. Sized for a sidebar or a footer column.",
    file: "components/sections/blog/blog-card-02.tsx", component: "BlogCard02", props: cardProps,
    node: (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="grid gap-4">
          {three.map((post) => <BlogCard02 key={post.title} post={post} />)}
        </div>
      </div>
    ),
  },
  {
    code: "BCARD-03", category: "Blog cards",
    label: "Editorial card with no image at all. Oversized numeral, big title, hairline, author and date.",
    file: "components/sections/blog/blog-card-03.tsx", component: "BlogCard03", props: "post: Post, index?: number, href?: string, className?: string",
    node: (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {three.map((post, i) => <BlogCard03 key={post.title} post={post} index={i + 1} />)}
        </div>
      </div>
    ),
  },
  {
    code: "BCARD-04", category: "Blog cards",
    label: "Overlap card. Photo panel with the text plate pulled up over its bottom edge, on a solid surface.",
    file: "components/sections/blog/blog-card-04.tsx", component: "BlogCard04", props: cardProps,
    node: (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {three.map((post) => <BlogCard04 key={post.title} post={post} />)}
        </div>
      </div>
    ),
  },
  {
    code: "BCARD-05", category: "Blog cards",
    label: "Wide feature card. Two columns, large photo, author avatar row and a read link whose arrow moves on hover.",
    file: "components/sections/blog/blog-card-05.tsx", component: "BlogCard05", props: "post: Post, href?: string, linkLabel?: string, className?: string",
    node: (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <BlogCard05 post={demoPosts[0]} />
      </div>
    ),
  },

  /* ------------------------------------------------------------- sections */
  {
    code: "BLOG-01", category: "Blog",
    label: "One large lead story beside a hairline separated list of the next four.",
    file: "components/sections/blog/blog-01.tsx", component: "Blog01",
    props: "heading?: SectionHeading, posts: Post[], cta?: Cta",
    node: (
      <Blog01
        heading={{ eyebrow: "From the logbook", title: "What twelve seasons on this coast taught us", body: "Crew notes on wind, water and the small decisions that make a day on the boat worth the money." }}
        posts={demoPosts}
        cta={{ label: "All logbook entries", href: "#journal" }}
      />
    ),
  },
  {
    code: "BLOG-02", category: "Blog",
    label: "Three up grid with a live category filter row, a running count and a real empty state.",
    file: "components/sections/blog/blog-02.tsx", component: "Blog02",
    props: "heading?: SectionHeading, posts: Post[], cta?: Cta, allLabel?: string",
    node: (
      <Blog02
        heading={{ eyebrow: "Journal", title: "Read before you book", body: "Planning notes, packing lists and the reef rules we ask every guest to follow." }}
        posts={demoPosts}
        cta={{ label: "Browse the full archive", href: "#archive" }}
      />
    ),
  },
  {
    code: "BLOG-03", category: "Blog",
    label: "Poster shaped stories on a swipeable auto slider. Tall photo, text on a solid plate below it.",
    file: "components/sections/blog/blog-03.tsx", component: "Blog03",
    props: "heading?: SectionHeading, posts: Post[], cta?: Cta",
    node: (
      <Blog03
        heading={{ eyebrow: "Slip 14 dispatches", title: "Stories the crew wrote between charters", body: "Written on the dock at Renaissance Marina, usually while the boat dries out." }}
        posts={demoPosts}
        cta={{ label: "See every dispatch", href: "#journal" }}
      />
    ),
  },
  {
    code: "BLOG-04", category: "Blog",
    label: "Magazine bento. Five stories at three sizes, closing on a full width colour band.",
    file: "components/sections/blog/blog-04.tsx", component: "Blog04",
    props: "heading?: SectionHeading, posts: Post[], cta?: Cta",
    node: (
      <Blog04
        heading={{ eyebrow: "Blue Water Sail", title: "The season, in five pieces", body: "One long read, two field notes and the fleet update guests keep asking for." }}
        posts={demoPosts}
        cta={{ label: "Older stories", href: "#archive" }}
      />
    ),
  },
  {
    code: "BLOG-05", category: "Blog",
    label: "Chronological archive grouped by month, sticky month label in the left margin, compact rows, no images.",
    file: "components/sections/blog/blog-05.tsx", component: "Blog05",
    props: "heading?: SectionHeading, posts: Post[], cta?: Cta",
    node: (
      <Blog05
        heading={{ eyebrow: "Archive", title: "Everything we have written, newest first", body: "Twelve seasons of logbooks, sorted by the month the entry was filed." }}
        posts={demoPosts}
        cta={{ label: "Subscribe to the crew letter", href: "#subscribe" }}
      />
    ),
  },
];
