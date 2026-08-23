import Link from "next/link";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, CircleDashed, Clock, ExternalLink,
  Image as ImageIcon, LoaderCircle, ShieldAlert, XCircle,
} from "lucide-react";
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
export type Asset = {
  id: string; source_url: string; storage_path: string | null; kind: string;
  status: string; width: number | null; height: number | null; bytes: number | null; skip_reason: string | null;
};
export type Site = {
  id: string; slug: string; name: string; status: string; source_url: string | null;
  domain: string | null; github_repo_url: string | null; preview_url: string | null;
  live_url: string | null; vercel_project: string | null; brief: string | null;
};

const ms = (n: number | null) => (n == null ? "-" : n < 1000 ? `${n}ms` : `${(n / 1000).toFixed(1)}s`);
const time = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";

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

export function SiteDetail({ site, jobs, events, pages, assets }: {
  site: Site; jobs: Job[]; events: Event[]; pages: ScrapePage[]; assets: Asset[];
}) {
  const failedJobs = jobs.filter((j) => j.status === "failed");
  const retrying = jobs.filter((j) => j.status === "pending" && j.attempts > 0);
  const failedPages = pages.filter((p) => p.status === "failed");
  const flagged = pages.filter((p) => p.injection_flags?.length);
  const skipped = assets.filter((a) => a.status === "skipped" || a.status === "failed");

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex h-[52px] items-center gap-3 border-b border-zinc-300 bg-zinc-50/95 px-5 backdrop-blur-md">
        <Link href="/dashboard" className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
          <ArrowLeft aria-hidden className="size-3.5" /> All sites
        </Link>
        <span className="font-display text-sm font-bold tracking-tight text-zinc-900">{site.name}</span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600">{site.slug}</span>
        <span className="ml-auto flex items-center gap-2">
          <StartScrapeButton siteId={site.id} disabled={!site.source_url} />
          <RunTickButton which="scrape" label="Scrape" />
          <RunTickButton which="provision" label="Provision" />
          {site.github_repo_url ? (
            <a href={site.github_repo_url} target="_blank" rel="noreferrer" title="Repository"
              className="cursor-pointer rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              <GitHubIcon className="size-4" /><span className="sr-only">Repository</span>
            </a>
          ) : null}
          {site.preview_url ?? site.live_url ? (
            <a href={site.live_url ?? site.preview_url ?? "#"} target="_blank" rel="noreferrer" title="Open the site"
              className="cursor-pointer rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              <ExternalLink aria-hidden className="size-4" /><span className="sr-only">Open the site</span>
            </a>
          ) : null}
        </span>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 p-6">
        {/* Problems first: the reason you opened this page. */}
        {failedJobs.length || failedPages.length || flagged.length || retrying.length ? (
          <div className="space-y-2">
            {failedJobs.map((j) => (
              <div key={j.id} className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
                <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />
                <p className="text-xs leading-relaxed text-red-900">
                  <span className="font-semibold">Step {j.position} ({j.step}) failed</span> after {j.attempts} of {j.max_attempts} attempts.
                  <span className="mt-1 block font-mono text-[11px] break-words">{j.error}</span>
                </p>
              </div>
            ))}
            {retrying.map((j) => (
              <div key={j.id} className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <p className="text-xs leading-relaxed text-amber-900">
                  <span className="font-semibold">{j.step} is retrying</span> (attempt {j.attempts} of {j.max_attempts}).
                  {j.error ? <span className="mt-1 block font-mono text-[11px] break-words">{j.error}</span> : null}
                </p>
              </div>
            ))}
            {flagged.length ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
                <p className="text-xs leading-relaxed text-amber-900">
                  <span className="font-semibold">{flagged.length} scraped page(s) contain prompt injection patterns.</span>{" "}
                  Build agents read this copy, so treat it as data and read it yourself before acting on it:{" "}
                  {flagged.map((p) => `${p.path} (${p.injection_flags.join(", ")})`).join("; ")}
                </p>
              </div>
            ) : null}
            {failedPages.length ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5">
                <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-700" />
                <p className="text-xs leading-relaxed text-red-900">
                  <span className="font-semibold">{failedPages.length} page(s) could not be scraped.</span>{" "}
                  {failedPages.slice(0, 3).map((p) => `${p.path ?? p.url}: ${p.error}`).join(" | ")}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* provisioning */}
        <Section title="Provisioning" count={`${jobs.filter((j) => j.status === "done").length}/${jobs.length} done`}>
          <ol className="divide-y divide-zinc-100">
            {jobs.map((j) => (
              <li key={j.id} className="flex items-start gap-3 px-4 py-2.5">
                <span className="mt-0.5 shrink-0"><StatusIcon status={j.status} /></span>
                <span className="w-6 shrink-0 font-mono text-[10px] text-zinc-400">{String(j.position).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-xs font-semibold text-zinc-800">{j.step}</span>
                    <span className={cn("font-mono text-[10px]", j.status === "failed" ? "text-red-600" : "text-zinc-500")}>{j.status}</span>
                    {j.attempts > 1 ? <span className="font-mono text-[10px] text-amber-600">{j.attempts} attempts</span> : null}
                  </span>
                  {j.error ? <span className="mt-0.5 block font-mono text-[10px] break-words text-red-700">{j.error}</span> : null}
                  {Object.keys(j.result ?? {}).length ? (
                    <span className="mt-0.5 block truncate font-mono text-[10px] text-zinc-500" title={JSON.stringify(j.result)}>
                      {JSON.stringify(j.result)}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-zinc-500">{ms(j.duration_ms)}</span>
              </li>
            ))}
            {!jobs.length ? <li className="px-4 py-6 text-center text-xs text-zinc-500">Not queued.</li> : null}
          </ol>
        </Section>

        {/* crawl */}
        <Section title="Scraped pages" count={`${pages.filter((p) => p.status === "done").length}/${pages.length} done`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-100 bg-zinc-50/60">
                <tr className="[&>th]:whitespace-nowrap [&>th]:px-4 [&>th]:py-2 [&>th]:font-mono [&>th]:text-[10px] [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-zinc-500">
                  <th></th><th>Path</th><th>HTTP</th><th>Title</th><th>Images</th><th>Depth</th><th>Time</th><th>Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pages.map((p) => (
                  <tr key={p.id} className="[&>td]:px-4 [&>td]:py-2">
                    <td><StatusIcon status={p.status} /></td>
                    <td className="max-w-56 truncate font-mono text-[11px] text-zinc-800" title={p.url}>{p.path ?? p.url}</td>
                    <td className="font-mono text-[10px] text-zinc-600">{p.http_status ?? "-"}</td>
                    <td className="max-w-56 truncate text-[11px] text-zinc-600" title={p.title ?? ""}>{p.title ?? "-"}</td>
                    <td className="font-mono text-[10px] text-zinc-600">{p.image_count}</td>
                    <td className="font-mono text-[10px] text-zinc-500">{p.depth}</td>
                    <td className="font-mono text-[10px] text-zinc-500">{ms(p.duration_ms)}</td>
                    <td className="max-w-64 truncate text-[10px]" title={p.error ?? p.injection_flags?.join(", ") ?? ""}>
                      {p.error ? <span className="text-red-700">{p.error}</span>
                        : p.injection_flags?.length ? <span className="text-amber-700">{p.injection_flags.join(", ")}</span> : ""}
                    </td>
                  </tr>
                ))}
                {!pages.length ? (
                  <tr><td colSpan={8} className="px-4 py-6 text-center text-xs text-zinc-500">Crawl not queued.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Section>

        {/* assets */}
        <Section title="Assets" count={`${assets.filter((a) => a.status === "stored").length} stored, ${skipped.length} skipped`}>
          <ul className="divide-y divide-zinc-100">
            {assets.slice(0, 60).map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-2">
                <StatusIcon status={a.status === "stored" ? "done" : a.status === "failed" ? "failed" : "skipped"} />
                <ImageIcon aria-hidden className="size-3.5 shrink-0 text-zinc-400" />
                <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-zinc-600" title={a.source_url}>
                  {a.storage_path ?? a.source_url}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-zinc-500">
                  {a.width && a.height ? `${a.width}x${a.height}` : ""} {a.bytes ? `${Math.round(a.bytes / 1024)}KB` : ""}
                </span>
                {a.skip_reason ? (
                  <span className="max-w-56 shrink-0 truncate text-[10px] text-amber-700" title={a.skip_reason}>{a.skip_reason}</span>
                ) : null}
              </li>
            ))}
            {!assets.length ? <li className="px-4 py-6 text-center text-xs text-zinc-500">No assets discovered yet.</li> : null}
          </ul>
        </Section>

        {/* raw timeline */}
        <Section title="Event log" count={`${events.length} entries`}>
          <ol className="divide-y divide-zinc-100 font-mono text-[10px]">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-start gap-3 px-4 py-1.5">
                <span className="shrink-0 text-zinc-400">{time(ev.started_at)}</span>
                <span className="shrink-0"><StatusIcon status={ev.status} /></span>
                <span className="w-28 shrink-0 font-semibold text-zinc-700">{ev.phase}</span>
                <span className="min-w-0 flex-1 break-words text-zinc-600">{JSON.stringify(ev.detail)}</span>
              </li>
            ))}
            {!events.length ? <li className="px-4 py-6 text-center text-zinc-500">Nothing logged yet.</li> : null}
          </ol>
        </Section>
      </div>
    </main>
  );
}
