import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post as BlogPost } from "@/content/demo";

/** Classic vertical card. Image in its own area, chip, title, excerpt, meta row. */
export function BlogCard01({ post, href = "#post", className }: {
  post: BlogPost; href?: string; className?: string;
}) {
  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg", className)}>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={post.image.src} alt={post.image.alt} loading="lazy" decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{post.category}</span>
        <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
          <a href={href} className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            {post.title}
          </a>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden className="size-3.5" />{post.date}</span>
          <span className="inline-flex items-center gap-1.5"><Clock aria-hidden className="size-3.5" />{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
