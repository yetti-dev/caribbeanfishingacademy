"use server";

/**
 * Dashboard mutations.
 *
 * These use the SERVICE ROLE, which bypasses RLS, so every one of them checks
 * the caller against factory_members first. Skipping that check would turn a
 * server action into an unauthenticated write endpoint for anyone who can reach
 * the deployed dashboard.
 */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { ok: true; message: string } | { ok: false; error: string };

/** Returns the caller's email only if they are an allowlisted member. */
async function requireMember(): Promise<string> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email;
  if (!email) throw new Error("not signed in");
  const { data: member } = await supabase
    .from("factory_members").select("email").ilike("email", email).maybeSingle();
  if (!member) throw new Error(`${email} is not on the factory allowlist`);
  return email;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export async function addSite(form: FormData): Promise<Result> {
  let email: string;
  try { email = await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }

  const sourceUrl = String(form.get("source_url") ?? "").trim();
  const nameRaw = String(form.get("name") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();
  const domainRaw = String(form.get("domain") ?? "").trim();
  const brief = String(form.get("brief") ?? "").trim() || null;
  const provision = form.get("provision") === "on";

  if (!sourceUrl) return { ok: false, error: "A source URL is required." };
  let host: string;
  try {
    const u = new URL(sourceUrl.startsWith("http") ? sourceUrl : `https://${sourceUrl}`);
    if (!/^https?:$/.test(u.protocol)) throw new Error("bad scheme");
    host = u.hostname.replace(/^www\./, "");
  } catch {
    return { ok: false, error: "That source URL does not parse." };
  }

  const slug = slugify(slugRaw || host.split(".")[0]);
  const name = nameRaw || host.split(".")[0].replace(/^./, (c) => c.toUpperCase());
  // Empty means "provision without a domain", which makes the DNS steps skip
  // rather than fail. That is the safe first run.
  const domain = domainRaw ? domainRaw.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase() : null;

  const db = createAdminClient();

  const { data: clash } = await db.from("sites").select("id").eq("slug", slug).maybeSingle();
  if (clash) return { ok: false, error: `A site with slug "${slug}" already exists.` };

  const { data: site, error } = await db
    .from("sites")
    .insert({
      slug, name, source_url: sourceUrl.startsWith("http") ? sourceUrl : `https://${sourceUrl}`,
      domain, brief, created_by: email,
    })
    .select("id, slug")
    .single();
  if (error || !site) return { ok: false, error: error?.message ?? "insert failed" };

  await db.from("runs").insert({ site_id: site.id, trigger: "dashboard", created_by: email });

  if (provision) {
    const { error: qErr } = await db.rpc("enqueue_provisioning", { p_site_id: site.id });
    if (qErr) return { ok: false, error: `site created but queueing failed: ${qErr.message}` };
  }

  revalidatePath("/dashboard");
  return {
    ok: true,
    message: provision
      ? `${site.slug} created and 10 provisioning steps queued.`
      : `${site.slug} created. Provisioning not queued.`,
  };
}

/**
 * Archive a site: keeps every row, drops it out of the default dashboard view.
 * Reversible, which is what you want for "this one is finished" or "this one was
 * a test".
 */
export async function setArchived(siteId: string, archived: boolean): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const db = createAdminClient();
  const { data: site } = await db.from("sites").select("slug, status").eq("id", siteId).maybeSingle();
  if (!site) return { ok: false, error: "site not found" };
  // Unarchiving cannot know the old status, so it returns to draft rather than
  // guessing something that might claim the site is live when it is not.
  const { error } = await db.from("sites")
    .update({ status: archived ? "archived" : "draft" }).eq("id", siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true, message: archived ? `${site.slug} archived.` : `${site.slug} restored to draft.` };
}

/**
 * Delete a site and everything recorded about it. IRREVERSIBLE.
 *
 * The caller must retype the slug, because the buttons sit in a dense table and a
 * misclick would otherwise erase a real client's whole history.
 *
 * Scope: database only. The GitHub repo and the Vercel project are NOT touched,
 * partly because deleting a repo needs a scope this token does not have, and
 * partly because a deployed client site should not vanish from a dashboard
 * click. The message says so rather than leaving it to be discovered.
 */
export async function deleteSite(siteId: string, confirmSlug: string): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const db = createAdminClient();
  const { data: site } = await db.from("sites")
    .select("slug, github_repo_url, vercel_project, is_deployed").eq("id", siteId).maybeSingle();
  if (!site) return { ok: false, error: "site not found" };
  if (confirmSlug.trim() !== site.slug) {
    return { ok: false, error: `Type "${site.slug}" exactly to confirm.` };
  }
  // Every child table is ON DELETE CASCADE, so this removes jobs, events, pages,
  // assets, deploys and domains with it.
  const { error } = await db.from("sites").delete().eq("id", siteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  const leftovers = [
    site.github_repo_url ? "the GitHub repo" : null,
    site.vercel_project ? "the Vercel project" : null,
  ].filter(Boolean);
  return {
    ok: true,
    message: leftovers.length
      ? `${site.slug} deleted from the database. ${leftovers.join(" and ")} still exist and must be removed by hand.`
      : `${site.slug} deleted.`,
  };
}

/** Queue the crawl for a site, then let the scrape worker walk it. */
export async function startScrape(siteId: string): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const db = createAdminClient();
  const { error } = await db.rpc("enqueue_scrape", { p_site_id: siteId });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true, message: "Crawl queued. Run the scrape worker to walk it." };
}

/** One tick of either worker. Named so the UI can drive both. */
export async function runWorker(which: "provision" | "scrape"): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const secret = process.env.TICK_SECRET ?? "";
  if (!url) return { ok: false, error: "SUPABASE_URL is not configured." };
  if (!secret) return { ok: false, error: "TICK_SECRET is not in this environment." };
  const fn = which === "provision" ? "provision-tick" : "scrape-tick";
  try {
    const res = await fetch(`${url}/functions/v1/${fn}`, {
      method: "POST", headers: { "x-tick-secret": secret }, signal: AbortSignal.timeout(90_000),
    });
    const body = (await res.json().catch(() => null)) as { claimed?: number; done?: Record<string, unknown>[]; error?: string } | null;
    if (!res.ok) return { ok: false, error: body?.error ?? `worker returned ${res.status}` };
    revalidatePath("/dashboard");
    const summary = (body?.done ?? []).map((d) => `${d.step ?? d.url}:${d.status}`).join(", ");
    return { ok: true, message: body?.claimed ? `${which}: ran ${body.claimed}. ${summary}` : `${which}: nothing due.` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/**
 * Kick the worker by hand. Useful before pg_cron is wired, and for "run it now"
 * rather than waiting for the next minute. The secret stays server side.
 */
export async function runTick(): Promise<Result> {
  try { await requireMember(); } catch (e) { return { ok: false, error: (e as Error).message }; }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const secret = process.env.TICK_SECRET ?? "";
  if (!url) return { ok: false, error: "SUPABASE_URL is not configured." };
  if (!secret) return { ok: false, error: "TICK_SECRET is not in this environment." };

  try {
    const res = await fetch(`${url}/functions/v1/provision-tick`, {
      method: "POST",
      headers: { "x-tick-secret": secret },
      signal: AbortSignal.timeout(60_000),
    });
    const body = (await res.json().catch(() => null)) as { claimed?: number; done?: { step: string; status: string }[] } | null;
    if (!res.ok) return { ok: false, error: `worker returned ${res.status}` };
    revalidatePath("/dashboard");
    const summary = (body?.done ?? []).map((d) => `${d.step}:${d.status}`).join(", ");
    return { ok: true, message: body?.claimed ? `Ran ${body.claimed} step(s). ${summary}` : "Nothing due." };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
