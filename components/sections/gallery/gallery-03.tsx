"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Img, SectionHeading } from "@/content/types";

/** Horizontal scroll snap filmstrip. Drag, wheel, arrow buttons or arrow keys. */
export function Gallery03({
  heading,
  images,
  className,
}: {
  heading?: SectionHeading;
  images: Img[];
  className?: string;
}) {
  const trackRef = React.useRef<HTMLUListElement>(null);

  const scrollBy = React.useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(-1);
    }
  };

  if (images.length === 0) return null;

  return (
    <section className={cn("bg-background py-20", className)}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6">
        <div className="max-w-xl">
          {heading?.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          {heading?.title ? (
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              {heading.title}
            </h2>
          ) : null}
          {heading?.body ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll to previous photographs"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll to next photographs"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Photograph filmstrip, use the left and right arrow keys"
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <li
            key={image.src + i}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30rem]"
          >
            <figure className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full object-cover transition duration-300 ease-out hover:scale-[1.04]"
              />
              <figcaption className="flex items-baseline gap-3 px-5 py-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-foreground">{image.alt}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
