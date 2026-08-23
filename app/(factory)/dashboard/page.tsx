import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { Dashboard } from "@/components/factory/dashboard";
import type { SiteOverview } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Dashboard" };
// Always fresh: a build's status changing is the whole point of the page.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!supabaseConfigured) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
        <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h1 className="font-display text-base font-bold text-amber-900">Supabase is not configured</h1>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env, then reload.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/dashboard");

  const email = auth.user.email ?? "";

  /*
   * The allowlist check is here rather than in middleware, because being signed
   * in is not permission: signups are open on this project, so any stranger can
   * create an account. RLS would return an empty list to a non-member anyway,
   * but an explicit message beats a dashboard that looks broken.
   */
  const { data: member } = await supabase
    .from("factory_members")
    .select("email, role")
    .ilike("email", email)
    .maybeSingle();

  if (!member) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
        <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="font-display text-base font-bold text-zinc-900">Not on the allowlist</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            <span className="font-mono text-xs">{email}</span> is signed in but has no factory membership,
            so there is nothing to show. Ask an owner to add the address.
          </p>
          <form action="/auth/signout" method="post" className="mt-4">
            <button type="submit"
              className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none">
              Sign out
            </button>
          </form>
        </div>
      </main>
    );
  }

  const { data: sites, error } = await supabase
    .from("site_overview")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-100 p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5">
          <h1 className="font-display text-base font-bold text-red-900">Could not read sites</h1>
          <p className="mt-2 font-mono text-xs leading-relaxed text-red-900">{error.message}</p>
        </div>
      </main>
    );
  }

  return <Dashboard sites={(sites ?? []) as SiteOverview[]} email={email} />;
}
