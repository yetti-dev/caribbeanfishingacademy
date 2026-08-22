import { ArrowRight, Anchor } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Full photo background with a saturated colour block carrying the copy.
 * The block is opaque, so contrast is the token pair's, not the photo's.
 */
export function Hero15({ eyebrow, title, body, image, ctas = [], note }: {
  eyebrow?: string; title: string; body: string; image: Img; ctas?: Cta[]; note?: string;
}) {
  return (
    <section className="relative isolate min-h-[84vh] bg-foreground">
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 z-0 size-full object-cover" />
      <div className="relative z-10 mx-auto grid min-h-[84vh] max-w-7xl items-center px-0 sm:px-6">
        <Reveal className="w-full sm:max-w-2xl">
          <div className="bg-primary p-8 text-primary-foreground sm:rounded-2xl sm:p-12 sm:shadow-2xl">
            <span className="inline-flex items-center gap-2 eyebrow opacity-85">
              <Anchor aria-hidden className="size-3.5" /> {eyebrow}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[0.94] tracking-tight text-balance sm:text-6xl">{title}</h1>
            <p className="mt-5 text-lg leading-relaxed opacity-90">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary-foreground/50 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"}>
                  {cta.label}
                  {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </a>
              ))}
            </div>
            {note ? <p className="mt-6 border-t border-primary-foreground/25 pt-4 text-xs opacity-80">{note}</p> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
