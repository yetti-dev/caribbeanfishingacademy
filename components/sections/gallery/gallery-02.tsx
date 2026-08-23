import { Camera } from "lucide-react";
import { Gallery as GalleryLightbox } from "@/components/magic/gallery";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/** Masonry columns with a keyboard accessible lightbox, headed by a split intro. */
export function Gallery02({
  heading,
  images,
  note,
  className,
}: {
  heading?: SectionHeading;
  images: Img[];
  note?: string;
  className?: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className={cn("border-y border-border bg-background py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-6 border-b border-border pb-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading?.title ? (
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
          </div>
          <div className="lg:text-right">
            {heading?.body ? (
              <p className="text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
            ) : null}
            <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Camera aria-hidden className="size-4" />
              {images.length} photographs
            </p>
          </div>
        </Reveal>

        <GalleryLightbox
          images={images.map((i) => ({ src: i.src, alt: i.alt }))}
          className="mt-10 lg:columns-4"
        />

        {note ? <p className="mt-8 text-sm text-muted-foreground">{note}</p> : null}
      </div>
    </section>
  );
}
