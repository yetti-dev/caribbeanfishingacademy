import { cn } from "@/lib/utils";
import type { Post as BlogPost } from "@/content/demo";

/** Horizontal compact card. Square thumb left, text right, mono meta line. Sidebar sized. */
export function BlogCard02({ post, href = "#post", className }: {
  post: BlogPost; href?: string; className?: string;
}) {
  return (
    <article className={cn("group relative flex items-start gap-4 rounded-xl border border-border bg-card p-3 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-md", className)}>
      <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-24">
        <img src={post.image.src} alt={post.image.alt} loading="lazy" decoding="async"
          className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
          {post.category} / {post.readingTime}
        </p>
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug tracking-tight text-foreground">
          <a href={href} className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            {post.title}
          </a>
        </h3>
        <p className="mt-1.5 font-mono text-[11px] tracking-wide text-muted-foreground">{post.date}</p>
      </div>
    </article>
  );
}
