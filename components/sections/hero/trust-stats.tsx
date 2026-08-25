import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";

export type TrustStat = { icon: string; value: string; label: string };

/**
 * The card that straddles a full-bleed hero and the section below it: a
 * white, rounded, floating strip of stat tiles pulled up over the hero's
 * bottom edge with a negative margin. Matches arubaflagship.getyetti.com's
 * stat strip exactly (verified from its own markup).
 */
export function TrustStats({ stats }: { stats: TrustStat[] }) {
  return (
    <div className="container-px relative z-10 mx-auto -mt-10 max-w-7xl sm:-mt-14">
      <div className="grid gap-4 rounded-3xl border border-border bg-card p-4 shadow-xl shadow-black/5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {stats.map((s) => (
          <Reveal key={s.label}>
            <div className="flex h-full items-start gap-4 rounded-2xl p-3 transition-colors duration-200 hover:bg-accent">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Icon name={s.icon} className="size-5" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold leading-none">{s.value}</p>
                <p className="mt-1.5 text-sm text-pretty text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
