"use server";

/** Save a picked layout against a site, so the dashboard shows the handoff. */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Result = { ok: true; code: string; message: string } | { ok: false; error: string };

/** Unguessable, and long enough that the share link is not worth brute forcing. */
function shareCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes).map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16);
}

export async function saveLayout(input: {
  siteSlug: string | null;
  theme: Record<string, unknown>;
  sections: string[];
  note?: string;
}): Promise<Result> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email;
  if (!email) return { ok: false, error: "not signed in" };

  const { data: member } = await supabase
    .from("factory_members").select("email").ilike("email", email).maybeSingle();
  if (!member) return { ok: false, error: `${email} is not on the factory allowlist` };

  if (!input.sections.length) return { ok: false, error: "Pick at least one section first." };

  const db = createAdminClient();

  let siteId: string | null = null;
  if (input.siteSlug) {
    const { data: site } = await db.from("sites").select("id").eq("slug", input.siteSlug).maybeSingle();
    if (!site) return { ok: false, error: `No site with slug "${input.siteSlug}".` };
    siteId = site.id;
  }

  // Version per site so a look can be rolled back or two attempts compared.
  let version = 1;
  if (siteId) {
    const { data: last } = await db.from("layouts")
      .select("version").eq("site_id", siteId).order("version", { ascending: false }).limit(1).maybeSingle();
    version = (last?.version ?? 0) + 1;
    // layouts_one_current is a partial unique index, so the old current has to be
    // cleared before the new row claims it.
    await db.from("layouts").update({ is_current: false }).eq("site_id", siteId).eq("is_current", true);
  }

  const code = shareCode();
  const { error } = await db.from("layouts").insert({
    site_id: siteId, share_code: code, version, is_current: Boolean(siteId),
    theme: input.theme, sections: input.sections,
    note: input.note ?? null, created_by: email,
  });
  if (error) return { ok: false, error: error.message };

  if (siteId) {
    await db.from("sites").update({ section_count: input.sections.length }).eq("id", siteId);
  }
  revalidatePath("/dashboard");
  return {
    ok: true, code,
    message: siteId
      ? `Saved as v${version} on ${input.siteSlug}. Visible on the dashboard.`
      : `Saved. Share code ${code}. Attach it to a site later.`,
  };
}

/** Sites a layout can be attached to. */
export async function listSites(): Promise<{ slug: string; name: string }[]> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user?.email) return [];
  const { data } = await supabase
    .from("sites").select("slug, name").neq("status", "archived").order("updated_at", { ascending: false });
  return data ?? [];
}
