import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetPasswordForm } from "@/components/factory/set-password-form";

export const metadata: Metadata = { title: "Set a password" };
export const dynamic = "force-dynamic";

/**
 * Reached from the reset email, after /auth/callback has exchanged the code for a
 * session. A recovery session is enough to change your own password and nothing
 * else, so no extra token handling is needed here.
 */
export default async function ResetPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?error=" + encodeURIComponent("That reset link has expired. Request another."));
  return <SetPasswordForm email={data.user.email ?? ""} />;
}
