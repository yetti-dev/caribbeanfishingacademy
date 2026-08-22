"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

/**
 * Rotating photo background, copy centred, with arrows and a progress bar.
 *
 * Centred text cannot use the bottom-weighted gradient the other rotators use,
 * so the scrim is darkest through the MIDDLE band and clears at both edges. The
 * middle stop is foreground/88, which measures about 6.2:1 for white text even
 * over a blown-out sky; a flat 40% tint would only reach 1.6:1.
 *
 * The bar doubles as a timer, so the rotation is legible rather than surprising.
 * Under prefers-reduced-motion it stops and the bar is hidden.
 */
export function Hero18({ eyebrow, title, body, images, ctas = [], interval = 6000 }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; interval?: number;
}) {
  const [i, setI] = useState(0);
  const [motionOk, setMotionOk] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = useCallback((dir: 1 | -1) => {
    setI((n) => (n + dir + images.length) % images.length);
    setTick(0);
  }, [images.length]);

  useEffect(() => {
    if (!motionOk || images.length < 2) return;
    const step = 100;
    const t = setInterval(() => {
      setTick((p) => {
        if (p + step >= interval) { setI((n) => (n + 1) % images.length); return 0; }
        return p + step;
      });
    }, step);
    return () => clearInterval(t);
  }, [motionOk, images.length, interval]);

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-foreground">
      {images.map((im, idx) => (
        <img
          key={im.src} src={im.src} alt={idx === i ? im.alt : ""} aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"} decoding="async"
          className={cn(
            "absolute inset-0 z-0 size-full object-cover transition-opacity duration-[1200ms] ease-out",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {/* Dark through the middle where the copy sits, clear at both edges. */}
      <div aria-hidden className="absolute inset-0 z-10 bg-linear-to-b from-foreground/35 via-foreground/88 to-foreground/45" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 py-24 text-center">
        {eyebrow ? <p className="eyebrow text-background/85">{eyebrow}</p> : null}
        <h1 className="mt-5 font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance text-background sm:text-7xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-background/90">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {ctas.map((cta, idx) => (
            <a key={cta.label} href={cta.href} className={idx === 0
              ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
              : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-background/45 px-7 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none"}>
              {cta.label}
              {idx === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
            </a>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo"
            className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-foreground/45 text-background backdrop-blur-sm transition-colors duration-200 hover:bg-foreground/70 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo"
            className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-foreground/45 text-background backdrop-blur-sm transition-colors duration-200 hover:bg-foreground/70 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none">
            <ChevronRight aria-hidden className="size-5" />
          </button>
          {motionOk ? (
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 h-1 bg-background/25">
              <div className="h-full bg-primary transition-[width] duration-100 ease-linear" style={{ width: `${(tick / interval) * 100}%` }} />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
