"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import type { Cta, Img } from "@/content/types";

/**
 * Video background with the copy ON the footage.
 *
 * Contrast is carried by a DIRECTIONAL gradient, not a flat scrim, because a
 * flat one has to be heavy everywhere to be safe and that throws away the shot.
 * Measured against a blown-out white sky, which is the worst case here, white
 * text needs about 88% black to clear 4.5:1, while 35% only reaches 1.5:1.
 *
 * So the overlay runs light at the top (~15%, footage stays bright) and deep in
 * the bottom band where the words actually sit (~92%, about 8:1). Most of the
 * frame reads as barely tinted while the copy is comfortably legible.
 *
 * Autoplay is muted and inline because iOS and Chrome require both, a poster
 * carries the first paint, and prefers-reduced-motion pauses rather than slows.
 */
export function Hero11({ eyebrow, title, body, videoSrc, poster, ctas = [], footnote }: {
  eyebrow?: string; title: string; body: string; videoSrc: string; poster: Img; ctas?: Cta[]; footnote?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { void v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-foreground">
      <video
        ref={ref} src={videoSrc} poster={poster.src} autoPlay muted loop playsInline preload="metadata"
        aria-label={poster.alt}
        className="absolute inset-0 z-0 size-full object-cover"
      />
      {/* Light at the top, deep where the copy sits. This IS the contrast. */}
      <div aria-hidden className="absolute inset-0 z-10 bg-linear-to-t from-foreground/92 via-foreground/55 to-foreground/15" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 sm:pb-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-background/85">{eyebrow}</p>
          ) : null}
          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance text-background sm:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-background/90">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctas.map((cta, i) => (
              <a key={cta.label} href={cta.href} className={i === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-background/50 px-6 py-3.5 text-sm font-semibold text-background transition-colors duration-200 hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"}>
                {cta.label}
                {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
          {footnote ? <p className="mt-6 text-xs text-background/70">{footnote}</p> : null}
        </div>
      </div>

      <button
        type="button" onClick={toggle} aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute right-5 top-5 z-20 grid size-10 cursor-pointer place-items-center rounded-full bg-foreground/50 text-background backdrop-blur-sm transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4 translate-x-px" />}
      </button>
    </section>
  );
}
