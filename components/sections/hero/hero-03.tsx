import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta } from "@/content/types";

/** Saturated colour block. No photograph, all type and conviction. */
export function Hero03({ eyebrow, title, body, ctas = [], footnote }: {
  eyebrow?: string; title: string; body: string; ctas?: Cta[]; footnote?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <Reveal>
          {eyebrow ? <p className="eyebrow opacity-80">{eyebrow}</p> : null}
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.92] tracking-tight text-balance sm:text-7xl lg:text-8xl">{title}</h1>
          <div className="mt-10 grid gap-8 border-t border-primary-foreground/25 pt-8 lg:grid-cols-[1.4fr_1fr]">
            <p className="max-w-2xl text-lg leading-relaxed opacity-90">{body}</p>
            <div className="flex flex-col items-start gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-1.5 border-b border-primary-foreground/50 pb-0.5 text-sm font-medium transition-colors hover:border-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"}>
                  {cta.label}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
              {footnote ? <p className="mt-1 text-xs opacity-75">{footnote}</p> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
