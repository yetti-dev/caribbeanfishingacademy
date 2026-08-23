/** Service-role Supabase client for workers. Bypasses RLS by design. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function adminDb(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "";
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type Site = {
  id: string;
  slug: string;
  name: string;
  source_url: string | null;
  domain: string | null;
  github_repo_url: string | null;
  vercel_project: string | null;
  vercel_scope: string | null;
};

export type Job = {
  id: string;
  site_id: string;
  step: string;
  position: number;
  attempts: number;
  max_attempts: number;
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
};

/** Record a phase for the dashboard timeline. */
export async function logEvent(
  db: SupabaseClient,
  siteId: string,
  phase: string,
  status: "ok" | "warn" | "failed" | "running" | "skipped",
  detail: Record<string, unknown> = {},
) {
  const { data: run } = await db
    .from("runs").select("id").eq("site_id", siteId)
    .order("started_at", { ascending: false }).limit(1).maybeSingle();
  if (!run) return;
  await db.from("run_events").insert({
    run_id: run.id, site_id: siteId, phase, status, detail,
    started_at: new Date().toISOString(), ended_at: new Date().toISOString(),
  });
}
