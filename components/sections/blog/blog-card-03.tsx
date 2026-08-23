import { cn } from "@/lib/utils";
import type { Post as BlogPost } from "@/content/demo";

/** Editorial card, type only. Oversized numeral, big title, hairline, author and date. */
export function BlogCard03({ post, index, href = "#post", className }: {
  post: BlogPost; index?: number; href?: string; className?: string;
}) {
  const marker = typeof index === "number" ? String(index).padStart(2, "0") : null;
  return (
    <article className={cn("group relative flex flex-col bg-background p-6 transition duration-200 ease-out hover:-translate-y-1", className)}>
      {marker ? (
        <span aria-hidden className="font-display text-6xl font-bold leading-none tracking-tight text-primary/25 transition-colors duration-200 ease-out group-hover:text-primary/50 sm:text-7xl">
          {marker}
        </span>
      ) : (
        <span className="eyebrow text-primary">{post.category}</span>
      )}
      <h3 className="mt-5 font-display text-2xl font-bold leading-[1.1] tracking-tight text-balance text-foreground sm:text-3xl">
        <a href={href} className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          {post.title}
        </a>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="mt-6 border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground">{post.author}</p>
        <p className="mt-0.5 font-mono text-[11px] tracking-wide text-muted-foreground">
          {post.date} / {post.readingTime}
        </p>
      </div>
    </article>
  );
}
