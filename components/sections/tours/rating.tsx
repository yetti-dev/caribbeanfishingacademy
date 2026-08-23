import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Star rating with an accessible label on the container. The icons and the
 * numerals are aria-hidden so a screen reader hears one sentence, not eleven
 * fragments. `stars` controls how many glyphs render (1 for the compact
 * Airbnb-style line, 5 for the full row).
 */
export function Rating({
  rating,
  reviews,
  stars = 5,
  showReviews = true,
  className,
  starClassName,
  mutedClassName = "text-muted-foreground/35",
  reviewClassName = "text-muted-foreground",
}: {
  rating: number;
  reviews: number;
  stars?: number;
  showReviews?: boolean;
  className?: string;
  starClassName?: string;
  mutedClassName?: string;
  reviewClassName?: string;
}) {
  const filled = Math.round(rating);
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating.toFixed(1)} out of 5 from ${reviews} reviews`}
    >
      <span aria-hidden className="inline-flex items-center gap-0.5">
        {Array.from({ length: stars }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              stars === 1 || i < filled
                ? cn("fill-current text-primary", starClassName)
                : mutedClassName,
            )}
          />
        ))}
      </span>
      <span aria-hidden className="text-xs font-semibold tabular-nums">
        {rating.toFixed(1)}
      </span>
      {showReviews ? (
        <span aria-hidden className={cn("text-xs tabular-nums", reviewClassName)}>
          ({reviews})
        </span>
      ) : null}
    </span>
  );
}
