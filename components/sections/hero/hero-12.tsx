"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cta, Img } from "@/content/types";

/**
 * Full-bleed photo background that cross-fades between images on a timer, with
 * a slow Ken Burns drift.
 *
 * Copy is on a solid panel for the same contrast reason as Hero11. Rotation
 * stops entirely under prefers-reduced-motion rather than merely slowing, and
 * the dots let someone pick a frame by hand.
 */
export function Hero12({ eyebrow, title, body, images, ctas = [], interval = 6000, badge }: {
  eyebrow?: string; title: string; body: string; images: Img[]; ctas?: Cta[]; interval?: number; badge?: string;
}) {
  const [i, setI] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOk(!mq.matches);
    const onChange = () => setMotionOk(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!motionOk || images.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [motionOk, images.length, interval]);

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-foreground">
      {images.map((im, idx) => (
        <img
          key={im.src} src={im.src} alt={idx === i ? im.alt : ""} aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"} decoding="async"
          className={cn(
            "absolute inset-0 z-0 size-full object-cover transition-opacity duration-1000 ease-out",
            idx === i ? "opacity-100" : "opacity-0",
            motionOk && "motion-safe:animate-[kenburns_18s_ease-out_infinite_alternate]",
          )}
        />
      ))}
      <div aria-hidden className="absolute inset-0 z-10 bg-foreground/20" />

      <div className="relative z-20 mx-auto flex min-h-[88vh] max-w-7xl items-end px-6 py-16">
        <div className="w-full max-w-2xl rounded-2xl bg-background/97 p-8 shadow-2xl backdrop-blur-sm sm:p-11">
          {badge ? (
            <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground">
              {badge}
            </span>
          ) : null}
          {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-3 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {ctas.map((cta, idx) => (
              <a key={cta.label} href={cta.href} className={idx === 0
                ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                {cta.label}
                {idx === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </a>
            ))}
          </div>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-6 right-6 z-20 flex gap-1.5">
          {images.map((im, idx) => (
            <button
              key={im.src} type="button" onClick={() => setI(idx)}
              aria-label={`Show image ${idx + 1} of ${images.length}`} aria-current={idx === i}
              className={cn(
                "h-1.5 cursor-pointer rounded-full bg-background transition-all duration-300 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none",
                idx === i ? "w-8" : "w-1.5 opacity-60 hover:opacity-100",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
