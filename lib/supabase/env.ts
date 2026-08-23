/**
 * Supabase configuration, read once so a missing variable fails loudly at the
 * edge of the app rather than as a confusing 401 later.
 *
 * NEXT_PUBLIC_* is required for anything the browser touches. The service role
 * key is deliberately NOT exported from this module: it lives in
 * lib/supabase/admin.ts behind a server-only import so it cannot be pulled into
 * a client bundle by accident.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
