import Link from "next/link";
import {
  CheckCircle2, CircleDashed, Clock, ExternalLink, Globe,
  LayoutList, ShieldCheck, XCircle,
} from "lucide-react";
// lucide-react v1 removed its brand icons, and the repo already keeps brand
// glyphs in components/icons.tsx, which is where CLAUDE.md says they belong.
import { GitHubIcon } from "@/components/icons";
import type { SiteOverview } from "@/lib/supabase/types";
import { AddSiteForm } from "@/components/factory/add-site-form";
import { RunTickButton } from "@/components/factory/run-tick-button";
import { cn } from "@/lib/utils";

export type Progress = {
  site_id: string;
  steps_total: number;
  steps_done: number;
  steps_failed: number;
  current_step: string | null;
  last_error: string | null;
  total_ms: number | null;
};

const fmtSeconds = (s: number | null) => {
  if (s == null) return "-";
  const m = Math.floor(s / 60);
  return m ? `${m}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "-";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  scraping: "bg-sky-50 text-sky-800 ring-sky-200",
  building: "bg-amber-50 text-amber-800 ring-amber-200",
  built: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  deploying: "bg-amber-50 text-amber-800 ring-amber-200",
  live: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

/** A yes/no metric. Explicitly "not yet" rather than a bare empty cell. */
function Flag({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1" title={`${label}: ${on ? "yes" : "not yet"}`}>
      {on ? (
        <CheckCircle2 aria-hidden className="size-3.5 text-emerald-600" />
      ) : (
        <CircleDashed aria-hidden className="size-3.5 text-zinc-300" />
      )}
      <span className="sr-only">{label}: {on ? "yes" : "not yet"}</span>
    </span>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

/** Steps done out of total, with the step currently in flight named. */
function ProgressCell({ p }: { p?: Progress }) {
  if (!p || !p.steps_total) return <span className="font-mono text-[10px] text-zinc-400">not queued</span>;
  const pct = Math.round((p.steps_done / p.steps_total) * 100);
  const tone = p.steps_failed ? "bg-red-500" : pct === 100 ? "bg-emerald-500" : "bg-amber-500";
  return (
    <span className="block min-w-32">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <span className={cn("block h-full rounded-full transition-[width] duration-500", tone)} style={{ width: `${pct}%` }} />
        </span>
        <span className="font-mono text-[10px] text-zinc-600">{p.steps_done}/{p.steps_total}</span>
      </span>
      <span className="mt-0.5 block truncate font-mono text-[10px] text-zinc-500" title={p.last_error ?? undefined}>
        {p.steps_failed ? `failed: ${p.current_step ?? "?"}` : p.current_step ? `running ${p.current_step}` : "complete"}
      </span>
    </span>
  );
}

export function Dashboard({ sites, email, progress = [] }: { sites: SiteOverview[]; email: string; progress?: Progress[] }) {
  const byId = new Map(progress.map((p) => [p.site_id, p]));
  const live = sites.filter((s) => s.status === "live").length;
  const failed = sites.filter((s) => s.status === "failed").length;
  const timed = sites.filter((s) => s.latest_run_seconds != null);
  const median = (() => {
    if (!timed.length) return null;
    const xs = timed.map((s) => s.latest_run_seconds!).sort((a, b) => a - b);
    return xs[Math.floor(xs.length / 2)];
  })();
  const withinBudget = timed.filter((s) => s.within_budget).length;
  const unstripped = sites.filter((s) => s.is_deployed && !s.factory_stripped);

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex h-[52px] items-center gap-4 border-b border-zinc-300 bg-zinc-50/95 px-5 backdrop-blur-md">
        <span className="font-display text-sm font-bold tracking-tight text-zinc-800">Factory dashboard</span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600">
          {sites.length} site{sites.length === 1 ? "" : "s"}
        </span>
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/sections"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
            <LayoutList aria-hidden className="size-3.5" /> Section picker
          </Link>
          <RunTickButton which="provision" label="Provision" />
          <RunTickButton which="scrape" label="Scrape" />
          <AddSiteForm />
          <span className="font-mono text-[11px] text-zinc-500">{email}</span>
        </nav>
      </header>

      <div className="mx-auto max-w-[1400px] p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Live" value={String(live)} hint={`${sites.length} tracked`} />
          <Stat label="Failed" value={String(failed)} />
          <Stat label="Median build" value={fmtSeconds(median)} hint="latest run per site" />
          <Stat label="Within 30 min" value={timed.length ? `${withinBudget}/${timed.length}` : "-"} />
          <Stat label="Unstripped" value={String(unstripped.length)} hint="deployed with tooling" />
        </div>

        {unstripped.length ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-semibold">{unstripped.length} deployed site(s) still report the factory as unstripped.</span>{" "}
              Stripping is the last pipeline step, so this is expected mid deploy, but a site that stays in
              this state has shipped the dashboard and the tooling to a client repo:{" "}
              {unstripped.map((s) => s.slug).join(", ")}.
            </p>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr className="[&>th]:whitespace-nowrap [&>th]:px-3 [&>th]:py-2.5 [&>th]:font-mono [&>th]:text-[10px] [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-zinc-500">
                  <th>Site</th><th>Status</th><th>Provisioning</th><th>Run</th><th>Sections</th>
                  <th title="GitHub repo created">Repo</th>
                  <th title="Vercel project created">Vercel</th>
                  <th title="Domain attached">Domain</th>
                  <th title="DNS record written">DNS</th>
                  <th title="DNS verified by Vercel">Verified</th>
                  <th title="Factory tooling stripped from the export">Stripped</th>
                  <th>Links</th><th>Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sites.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-zinc-50 [&>td]:whitespace-nowrap [&>td]:px-3 [&>td]:py-2.5">
                    <td>
                      <Link href={`/dashboard/${s.slug}`}
                        className="cursor-pointer font-medium text-zinc-900 underline-offset-2 transition-colors hover:text-zinc-600 hover:underline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                        {s.name}
                      </Link>
                      <span className="block font-mono text-[10px] text-zinc-500">{s.slug}</span>
                    </td>
                    <td>
                      <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ring-1", STATUS_TONE[s.status] ?? STATUS_TONE.draft)}>
                        {s.status}
                      </span>
                    </td>
                    <td><ProgressCell p={byId.get(s.id)} /></td>
                    <td>
                      <span className={cn("inline-flex items-center gap-1 font-mono text-[11px]", s.within_budget === false ? "text-red-700" : "text-zinc-700")}>
                        <Clock aria-hidden className="size-3" />
                        {fmtSeconds(s.latest_run_seconds)}
                      </span>
                      {s.latest_run_status === "failed" ? (
                        <XCircle aria-hidden className="ml-1 inline size-3 text-red-600" />
                      ) : null}
                    </td>
                    <td className="font-mono text-[11px] text-zinc-600">{s.current_layout_sections || s.section_count}</td>
                    <td><Flag on={s.github_repo_created} label="Repo created" /></td>
                    <td><Flag on={s.vercel_project_created} label="Vercel project created" /></td>
                    <td><Flag on={s.domain_added} label="Domain attached" /></td>
                    <td><Flag on={s.dns_written} label="DNS record written" /></td>
                    <td><Flag on={s.dns_verified} label="DNS verified" /></td>
                    <td><Flag on={s.factory_stripped} label="Factory stripped" /></td>
                    <td>
                      <span className="flex items-center gap-2">
                        {s.live_url ? (
                          <a href={s.live_url} target="_blank" rel="noreferrer" title={s.live_url}
                            className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                            <Globe aria-hidden className="size-3.5" /><span className="sr-only">Live site</span>
                          </a>
                        ) : null}
                        {s.latest_deploy_url ?? s.preview_url ? (
                          <a href={s.latest_deploy_url ?? s.preview_url ?? "#"} target="_blank" rel="noreferrer" title="Latest deploy"
                            className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                            <ExternalLink aria-hidden className="size-3.5" /><span className="sr-only">Latest deploy</span>
                          </a>
                        ) : null}
                        {s.github_repo_url ? (
                          <a href={s.github_repo_url} target="_blank" rel="noreferrer" title="Repository"
                            className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                            <GitHubIcon className="size-3.5" /><span className="sr-only">Repository</span>
                          </a>
                        ) : null}
                      </span>
                    </td>
                    <td className="font-mono text-[10px] text-zinc-500">{fmtDate(s.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!sites.length ? (
            <div className="p-12 text-center">
              <p className="font-display text-base font-semibold text-zinc-700">No sites recorded yet</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-zinc-500">
                The pipeline writes a row when a build starts. Run <span className="font-mono text-xs">npm run deploy</span>{" "}
                to record one, or open the section picker to prepare a layout first.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
