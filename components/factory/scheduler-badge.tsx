"use client";

import { useEffect, useState } from "react";
import { Clock, TriangleAlert, Zap } from "lucide-react";
import { schedulerStatus } from "@/app/(factory)/dashboard/actions";
import { cn } from "@/lib/utils";

type Status = {
  jobs?: { name: string; schedule: string; active: boolean }[];
  secrets_present?: string[];
  recent_http_responses?: { status: number; at: string }[];
  error?: string;
};

/**
 * Is the scheduler actually running?
 *
 * Worth its own indicator because cron can report success while every request
 * 401s, and "it is scheduled" then becomes a belief rather than a fact. This
 * checks the jobs exist, the Vault secrets exist, and recent HTTP calls returned
 * 200.
 */
export function SchedulerBadge() {
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    const load = () => schedulerStatus().then(setS).catch(() => setS({ error: "unreachable" }));
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  if (!s) return null;

  const jobs = s.jobs ?? [];
  const active = jobs.filter((j) => j.active).length;
  const secrets = (s.secrets_present ?? []).length;
  const lastHttp = s.recent_http_responses?.[0];
  const healthy = active === 2 && secrets === 2 && (!lastHttp || lastHttp.status === 200);

  const detail = s.error
    ? s.error
    : active !== 2
      ? `${active}/2 cron jobs active`
      : secrets !== 2
        ? `${secrets}/2 Vault secrets present, the worker cannot authenticate`
        : lastHttp && lastHttp.status !== 200
          ? `last worker call returned ${lastHttp.status}`
          : "provision every minute, crawl every 2 minutes";

  return (
    <span
      title={detail}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ring-1",
        healthy ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-900 ring-amber-200",
      )}
    >
      {healthy ? <Zap aria-hidden className="size-3.5" /> : <TriangleAlert aria-hidden className="size-3.5" />}
      {healthy ? "Auto" : "Manual"}
      <span className="font-mono text-[10px] font-normal opacity-70">
        {healthy ? <Clock aria-hidden className="inline size-3" /> : null} {healthy ? "1m" : detail.slice(0, 34)}
      </span>
    </span>
  );
}
