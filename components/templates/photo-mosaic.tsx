"use client";

import * as React from "react";
import { Grid2x2, X } from "lucide-react";
import { Gallery } from "@/components/magic/gallery";
import type { Img } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The listing style photo header: one tall frame, four small ones, and a
 * button that swaps the mosaic for the full Gallery grid with its lightbox.
 */
export function PhotoMosaic({
  images,
  className,
  showAllLabel = "Show all photos",
}: {
  images: Img[];
  className?: string;
  showAllLabel?: string;
}) {
  const [all, setAll] = React.useState(false);
  const five = images.slice(0, 5);
  if (five.length === 0) return null;

  if (all) {
    return (
      <div className={cn("", className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {images.length} photos aboard
          </p>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition duration-200 ease-out hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X aria-hidden className="size-4" />
            Close the grid
          </button>
        </div>
        <Gallery images={images.map((i) => ({ src: i.src, alt: i.alt }))} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
        {five.map((im, i) => (
          <button
            key={im.src + i}
            type="button"
            onClick={() => setAll(true)}
            aria-label={`Open all photos, starting from: ${im.alt}`}
            className={cn(
              "group relative block cursor-pointer overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              i === 0
                ? "aspect-[4/3] sm:row-span-2 sm:aspect-auto lg:col-span-2"
                : "aspect-[4/3]",
              i === 1 || i === 2 ? "hidden sm:block" : "",
              i > 2 ? "hidden lg:block" : "",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={im.src}
              alt={im.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAll(true)}
        className="absolute right-4 bottom-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Grid2x2 aria-hidden className="size-4" />
        {showAllLabel}
      </button>
    </div>
  );
}
