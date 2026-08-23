"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, CircleDashed, Clock, ExternalLink,
  FileText, Images, Link2, LayoutList, LoaderCircle, ScrollText, ShieldAlert, XCircle,
} from "lucide-react";
import { AssetGrid, type AssetRow } from "@/components/factory/asset-grid";
import { GitHubIcon } from "@/components/icons";
import { RunTickButton } from "@/components/factory/run-tick-button";
import { StartScrapeButton } from "@/components/factory/start-scrape-button";
import { cn } from "@/lib/utils";

export type Job = {
  id: string; step: string; position: number; status: string; attempts: number;
  max_attempts: number; duration_ms: number | null; error: string | null;
  result: Record<string, unknown>; started_at: string | null; finished_at: string | null;
};
export type Event = {
  id: string; phase: string; status: string; detail: Record<string, unknown>;
  started_at: string; duration_ms: number | null;
};
export type ScrapePage = {
  id: string; url: string; path: string | null; depth: number; status: string;
  http_status: number | null; title: string | null; image_count: number;
  injection_flags: string[]; duration_ms: number | null; error: string | null; attempts: number;
};
export type Asset = AssetRow;
export type Layout = {
  share_code: string; version: number; is_current: boolean;
  theme: Record<string, unknown>; sections: string[]; note: string | null; created_at: string;
};
export type ContentFile = { path: string; body: string; bytes: number | null };
export type Site = {
  id: string; slug: string; name: string; status: string; source_url: string | null;
  domain: string | null; github_repo_url: string | null; preview_url: string | null;
  live_url: string | null; vercel_project: string | null; vercel_scope: string | null; brief: string | null;
};

type Tab = "steps" | "logs" | "content" | "images" | "layout" | "links";

/** Queue enum on the left, what a human calls it on the right. */
const STEP_LABEL: Record<string, string> = {
  repo: "Creating repo", strip: "Stripping factory", holding: "Holding page",
  vercel_project: "Vercel project", deploy: "Deploying", deploy_wait: "Waiting on build",
  domain: "Attaching domain", dns: "Writing DNS", dns_verify: "Verifying DNS",
  smoke: "Checking it serves",
};

const ms = (n: number | null) => (n == null ? "-" : n < 1000 ? `${n}ms` : `${(n / 1000).toFixed(1)}s`);
const time = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

/**
 * A job row carries two facts: its status and how many attempts it has had. A
 * pending job with zero attempts has not started; a pending job with attempts is
 * retrying. Collapsing both to "pending" hid the difference that matters.
 */
function stepState(status: string, attempts: number): { label: string; tone: string } {
  if (status === "done") return { label: "Complete", tone: "text-emerald-700 bg-emerald-50 ring-emerald-200" };
  if (status === "skipped") return { label: "Skipped", tone: "text-zinc-500 bg-zinc-100 ring-zinc-200" };
  if (status === "failed") return { label: "Failed", tone: "text-red-700 bg-red-50 ring-red-200" };
  if (status === "running") return { label: "Running", tone: "text-sky-700 bg-sky-50 ring-sky-200" };
  if (attempts > 0) return { label: "Retrying", tone: "text-amber-700 bg-amber-50 ring-amber-200" };
  return { label: "Not started", tone: "text-zinc-400 bg-zinc-50 ring-zinc-200" };
}

/** One icon per outcome, so scanning the list needs no colour vocabulary. */
function StatusIcon({ status }: { status: string }) {
  if (status === "done" || status === "ok") return <CheckCircle2 aria-hidden className="size-4 text-emerald-600" />;
  if (status === "failed") return <XCircle aria-hidden className="size-4 text-red-600" />;
  if (status === "warn") return <AlertTriangle aria-hidden className="size-4 text-amber-600" />;
  if (status === "running") return <LoaderCircle aria-hidden className="size-4 animate-spin text-sky-600" />;
  if (status === "skipped") return <CircleDashed aria-hidden className="size-4 text-zinc-400" />;
  return <CircleDashed aria-hidden className="size-4 text-zinc-300" />;
}

function Section({ title, count, children }: { title: string; count?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{title}</h2>
        {count ? <span className="font-mono text-[10px] text-zinc-400">{count}</span> : null}
      </header>
      {children}
    </section>
  );
}

export function SiteDetail({ site, jobs, events, pages, assets, layouts = [], contentFiles = [] }: {
  site: Site; jobs: Job[]; events: Event[]; pages: ScrapePage[]; assets: Asset[];
  layouts?: Layout[]; contentFiles?: ContentFile[];
}) {
  const [tab, setTab] = useState<Tab>("steps");

  const failedJobs = jobs.filter((j) => j.status === "failed");
  const retrying = jobs.filter((j) => j.status === "pending" && j.attempts > 0);
  const failedPages = pages.filter((p) => p.status === "failed");
  const flagged = pages.filter((p) => p.injection_flags?.length);
  const current = layouts.find((l) => l.is_current) ?? layouts[0];

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "steps", label: "Steps", icon: <LayoutList aria-hidden className="size-3.5" />, count: jobs.length },
    { id: "logs", label: "Logs", icon: <ScrollText aria-hidden className="size-3.5" />, count: events.length },
    { id: "content", label: "Content", icon: <FileText aria-hidden className="size-3.5" />, count: pages.length },
    { id: "images", label: "Images", icon: <Images aria-hidden className="size-3.5" />, count: assets.length },
    { id: "layout", label: "Layout", icon: <CheckCircle2 aria-hidden className="size-3.5" />, count: layouts.length },
    { id: "links", label: "Links", icon: <Link2 aria-hidden className="size-3.5" /> },
  ];

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 border-b border-zinc-300 bg-zinc-50/95 backdrop-blur-md">
        <div className="flex h-[52px] items-center gap-3 px-5">
          <Link href="/dashboard" className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
            <ArrowLeft aria-hidden className="size-3.5" /> All sites
          </Link>
          <span className="font-display text-sm font-bold tracking-tight text-zinc-900">{site.name}</span>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600">{site.slug}</span>
          <span className="ml-auto flex items-center gap-2">
            <StartScrapeButton siteId={site.id} disabled={!site.source_url} />
            <RunTickButton which="scrape" label="Scrape" />
            <RunTickButton which="provision" label="Provision" />
          </span>
        </div>
        <nav role="tablist" aria-label="Site detail" className="flex gap-1 px-5 pb-2">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none",
                tab === t.id ? "bg-zinc-800 text-white" : "text-zinc-600 hover:bg-zinc-200",
              )}>
              {t.icon}{t.label}
              {t.count != null ? <span className={cn("font-mono text-[10px]", tab === t.id ? "text-zinc-300" : "text-zinc-400")}>{t.count}</span> : null}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 p-6">
        {/* Problems stay visible on every tab: they are why you opened this page. */}
        {failedJobs.map((j) => (
          <div key={j.id} className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
            <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />
            <p className="text-xs leading-relaxed text-red-900">
              <span className="font-semibold">{j.step} failed</span> after {j.attempts} of {j.max_attempts} attempts.
              <span className="mt-1 block font-mono text-[11px] break-words">{j.error}</span>
            </p>
          </div>
        ))}
        {retrying.map((j) => (
          <div key={j.id} className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-semibold">{j.step} retrying</span> (attempt {j.attempts} of {j.max_attempts}).
              {j.error ? <span className="mt-1 block font-mono text-[11px] break-words">{j.error}</span> : null}
            </p>
          </div>
        ))}
        {flagged.length ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <p className="text-xs leading-relaxed text-amber-900">
              <span className="font-semibold">{flagged.length} scraped page(s) contain prompt-injection patterns.</span>{" "}
              Build agents read this copy, so read it yourself first:{" "}
              {flagged.map((p) => `${p.path} (${p.injection_flags.join(", ")})`).join("; ")}
            </p>
          </div>
        ) : null}

        {tab === "steps" ? (
          <Section title="Provisioning" count={`${jobs.filter((j) => j.status === "done").length}/${jobs.length} done`}>
            <ol className="divide-y divide-zinc-100">
              {jobs.map((j) => (
                <li key={j.id} className="flex items-start gap-3 px-4 py-2.5">
                  <span className="mt-0.5 shrink-0"><StatusIcon status={j.status} /></span>
                  <span className="w-6 shrink-0 font-mono text-[10px] text-zinc-400">{String(j.position).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xs font-semibold text-zinc-800">{STEP_LABEL[j.step] ?? j.step}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{j.step}</span>
                      {j.attempts > 1 ? <span className="font-mono text-[10px] text-amber-600">{j.attempts} attempts</span> : null}
                    </span>
                    {j.error ? <span className="mt-0.5 block font-mono text-[10px] break-words text-red-700">{j.error}</span> : null}
                    {Object.keys(j.result ?? {}).length ? (
                      <span className="mt-0.5 block truncate font-mono text-[10px] text-zinc-500" title={JSON.stringify(j.result)}>{JSON.stringify(j.result)}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-500">{ms(j.duration_ms)}</span>
                </li>
              ))}
              {!jobs.length ? <li className="px-4 py-6 text-center text-xs text-zinc-500">Not queued.</li> : null}
            </ol>
          </Section>
        ) : null}

        {tab === "logs" ? (
          <Section title="Event log" count={`${events.length} entries`}>
            <ol className="divide-y divide-zinc-100 font-mono text-[10px]">
              {events.map((ev) => (
                <li key={ev.id} className="flex items-start gap-3 px-4 py-1.5">
                  <span className="shrink-0 text-zinc-400">{time(ev.started_at)}</span>
                  <span className="shrink-0"><StatusIcon status={ev.status} /></span>
                  <span className="w-24 shrink-0 font-semibold text-zinc-700">{ev.phase}</span>
                  <span className="min-w-0 flex-1 break-words text-zinc-600">{JSON.stringify(ev.detail)}</span>
                </li>
              ))}
              {!events.length ? <li className="px-4 py-6 text-center text-zinc-500">Nothing logged yet.</li> : null}
            </ol>
          </Section>
        ) : null}

        {tab === "content" ? (
          <>
            <Section title="Scraped pages" count={`${pages.filter((p) => p.status === "done").length}/${pages.length} done`}>
              <ul className="divide-y divide-zinc-100">
                {pages.map((p) => (
                  <li key={p.id} className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <StatusIcon status={p.status} />
                      <span className="font-mono text-[11px] font-semibold text-zinc-800">{p.path ?? p.url}</span>
                      <span className="font-mono text-[10px] text-zinc-500">HTTP {p.http_status ?? "-"}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{p.image_count} images</span>
                      <span className="font-mono text-[10px] text-zinc-400">depth {p.depth}</span>
                      <span className="ml-auto font-mono text-[10px] text-zinc-500">{ms(p.duration_ms)}</span>
                    </span>
                    {p.title ? <span className="mt-1 block text-xs text-zinc-700">{p.title}</span> : null}
                    {p.error ? <span className="mt-1 block font-mono text-[10px] text-red-700">{p.error}</span> : null}
                    {p.injection_flags?.length ? (
                      <span className="mt-1 block font-mono text-[10px] text-amber-700">injection: {p.injection_flags.join(", ")}</span>
                    ) : null}
                  </li>
                ))}
                {!pages.length ? <li className="px-4 py-6 text-center text-xs text-zinc-500">Crawl not queued.</li> : null}
              </ul>
            </Section>
            {contentFiles.length ? (
              <Section title="Generated copy" count={`${contentFiles.length} file(s)`}>
                <ul className="divide-y divide-zinc-100">
                  {contentFiles.map((f) => (
                    <li key={f.path} className="flex items-center gap-3 px-4 py-2">
                      <FileText aria-hidden className="size-3.5 shrink-0 text-zinc-400" />
                      <span className="font-mono text-[11px] text-zinc-700">{f.path}</span>
                      <span className="ml-auto font-mono text-[10px] text-zinc-500">{f.bytes ? `${Math.round(f.bytes / 1024)}KB` : ""}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </>
        ) : null}

        {tab === "images" ? (
          <Section title="Assets" count={`${assets.filter((a) => a.status === "stored").length} stored of ${assets.length}`}>
            <AssetGrid assets={assets} />
          </Section>
        ) : null}

        {tab === "layout" ? (
          <Section title="Saved layouts" count={`${layouts.length}`}>
            {current ? (
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold text-white">{current.share_code}</span>
                  <span className="font-mono text-[10px] text-zinc-500">v{current.version}</span>
                  {current.is_current ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-800 ring-1 ring-emerald-200">current</span> : null}
                  <span className="font-mono text-[10px] text-zinc-500">{current.sections.length} sections</span>
                </div>
                {current.note ? <p className="text-xs leading-relaxed text-zinc-600">{current.note}</p> : null}
                <ol className="grid gap-1 sm:grid-cols-2">
                  {current.sections.map((code, i) => (
                    <li key={`${code}-${i}`} className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-1.5">
                      <span className="font-mono text-[10px] text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[11px] font-semibold text-zinc-700">{code}</span>
                    </li>
                  ))}
                </ol>
                <pre className="overflow-x-auto rounded-lg bg-zinc-50 p-3 font-mono text-[10px] text-zinc-600">{JSON.stringify(current.theme, null, 2)}</pre>
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  This is a starting point for the look. The build is expected to add sections the content
                  needs and write custom components where nothing in the library fits.
                </p>
              </div>
            ) : (
              <p className="p-8 text-center text-xs text-zinc-500">
                No layout saved. Pick sections at /sections and use the Save tool.
              </p>
            )}
          </Section>
        ) : null}

        {tab === "links" ? (
          <Section title="Links">
            <ul className="divide-y divide-zinc-100">
              {([
                ["Source site", site.source_url],
                ["GitHub repo", site.github_repo_url],
                ["Live domain", site.domain ? `https://${site.domain}` : null],
                ["Vercel preview", site.preview_url],
                ["Vercel project", site.vercel_project ? `https://vercel.com/${site.vercel_scope ?? ""}/${site.vercel_project}` : null],
                ["Clone command", site.github_repo_url ? `git clone ${site.github_repo_url}.git` : null],
                ["Pull command", `npm run pull -- ${site.slug}`],
              ] as [string, string | null][]).map(([label, value]) => (
                <li key={label} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                  <span className="w-32 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{label}</span>
                  {value ? (
                    /^https?:\/\//.test(value) ? (
                      <a href={value} target="_blank" rel="noreferrer"
                        className="min-w-0 flex-1 cursor-pointer truncate font-mono text-[11px] text-sky-700 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
                        {value}
                      </a>
                    ) : (
                      <code className="min-w-0 flex-1 truncate rounded bg-zinc-50 px-2 py-1 font-mono text-[11px] text-zinc-700">{value}</code>
                    )
                  ) : (
                    <span className="text-[11px] text-zinc-400">not yet</span>
                  )}
                  {value && /^https?:\/\//.test(value) ? <ExternalLink aria-hidden className="size-3 shrink-0 text-zinc-400" /> : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </main>
  );
}
