import "server-only";

/**
 * Service role client. BYPASSES RLS ENTIRELY.
 *
 * Rules, because a mistake here is not recoverable:
 *  - `server-only` makes importing this from a client component a build error.
 *  - The key is never NEXT_PUBLIC_, so it cannot reach the browser bundle.
 *  - Use it for pipeline writes and for reads that must ignore RLS. Never use it
 *    to serve data straight to a browser request without checking the caller
 *    first: that would hand every client record to anyone who finds the route.
 *  - scripts/lib/export.mjs fails the deploy if any exported file references it.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY ?? "";

export const adminConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE);

export function createAdminClient() {
  if (!adminConfigured) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use the admin client.",
    );
  }
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
