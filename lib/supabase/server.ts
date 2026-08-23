import "server-only";

/**
 * Server client scoped to the SIGNED IN USER, reading and refreshing the auth
 * cookies. Every query still passes through RLS, which is what we want for
 * anything a browser triggered.
 *
 * For pipeline writes use lib/supabase/admin.ts instead.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export async function createClient() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read only. The
          // middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
