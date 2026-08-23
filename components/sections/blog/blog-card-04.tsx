import { cn } from "@/lib/utils";
import type { Post as BlogPost } from "@/content/demo";

/** Overlap card. Image panel with a solid text card pulled up over its bottom edge. */
export function BlogCard04({ post, href = "#post", className }: {
  post: BlogPost; href?: string; className?: string;
}) {
  return (
    <article className={cn("group relative flex flex-col transition duration-200 ease-out hover:-translate-y-1", className)}>
      <div className="aspect-[5/4] overflow-hidden rounded-2xl bg-muted">
        <img src={post.image.src} alt={post.image.alt} loading="lazy" decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="-mt-12 mx-4 flex-1 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-200 ease-out group-hover:shadow-lg">
        <p className="eyebrow text-primary">{post.category}</p>
        <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
          <a href={href} className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            {post.title}
          </a>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <p className="mt-4 font-mono text-[11px] tracking-wide text-muted-foreground">
          {post.author} / {post.date}
        </p>
      </div>
    </article>
  );
}
