"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Anchor, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

/**
 * Rotating photo background, copy centred. Auto crossfades on a timer, no
 * visible arrows or progress bar (matches arubaflagship.getyetti.com's own
 * hero exactly: a plain background rotation, no chrome on top of it).
 * Under prefers-reduced-motion it stops on the first image.
 */
export function Hero18({ eyebrow, title, body, images, ctas = [], interval = 6000, badge, compact = false }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; interval?: number;
  /** Optional trust pill (rating badge, press mention) shown above the title. */
  badge?: ReactNode;
  /** Shorter, for an inner page hero rather than the home page flagship. */
  compact?: boolean;
}) {
  const [i, setI] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionOk || images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [motionOk, images.length, interval]);

  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden",
        compact ? "min-h-[62vh] pt-28 sm:pt-32" : "min-h-[90vh] pt-24 sm:pt-28",
      )}
    >
      {images.map((im, idx) => (
        <img
          key={im.src} src={im.src} alt={idx === i ? im.alt : ""} aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"} decoding="async"
          className={cn(
            "absolute inset-0 z-0 size-full object-cover transition-opacity duration-[1000ms] ease-in-out",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

      <div className="container-px relative z-10 mx-auto w-full max-w-3xl py-24 sm:py-28">
        {/* Glass card: the hero's whole message sits on its own frosted panel,
            not floating raw over the image, so it reads as designed rather
            than as text dropped on a photo. A soft navy-to-light-blue glow
            sits behind it (unclipped, so it blooms past the edges), the
            panel itself carries only a whisper of tint at very low opacity
            so the photo reads through clearly, and a white sheen fakes the
            highlight real glass catches up top. */}
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-8 rounded-[2.75rem] bg-gradient-to-br from-primary/20 via-transparent to-navy/25 opacity-60 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-primary/6 to-navy/12 p-8 text-center text-white shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-2xl sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 via-white/0 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-white/8 blur-3xl" />
          <div className="relative">
          {eyebrow ? (
            <span className="mx-auto inline-flex w-fit items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              <Anchor aria-hidden className="size-3.5" />
              {eyebrow}
            </span>
          ) : null}
          {badge ? <div className="mt-5 flex justify-center">{badge}</div> : null}
          <h1 className="text-gradient-light mx-auto mt-6 max-w-2xl text-balance text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">{body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {ctas.map((cta, idx) => (
              <a key={cta.label} href={cta.href} data-yetti-activity={cta.activityId} className={idx === 0
                ? "group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-gradient px-7 text-base font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                : "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 text-base font-medium text-white transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"}>
                {cta.label}
                {idx === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
