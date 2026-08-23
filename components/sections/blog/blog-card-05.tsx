import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post as BlogPost } from "@/content/demo";

const initials = (name: string) =>
  name.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();

/** Wide feature card. Two columns, large image, author avatar row, arrow link. */
export function BlogCard05({ post, href = "#post", linkLabel = "Read the piece", className }: {
  post: BlogPost; href?: string; linkLabel?: string; className?: string;
}) {
  return (
    <article className={cn("group relative grid overflow-hidden rounded-2xl border border-border bg-card transition duration-200 ease-out hover:-translate-y-1 hover:shadow-xl md:grid-cols-2", className)}>
      <div className="aspect-[16/10] overflow-hidden bg-muted md:aspect-auto md:h-full">
        <img src={post.image.src} alt={post.image.alt} loading="lazy" decoding="async"
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-col justify-center p-7 lg:p-10">
        <p className="eyebrow text-primary">{post.category}</p>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-balance text-foreground lg:text-3xl">
          <a href={href} className="cursor-pointer rounded-sm transition-colors duration-200 ease-out group-hover:text-primary after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            {post.title}
          </a>
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-7 flex items-center gap-3">
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials(post.author)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{post.author}</p>
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground">{post.date} / {post.readingTime}</p>
          </div>
        </div>
        <span className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary">
          {linkLabel}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
