/**
 * Session refresh plus the gate on the factory routes.
 *
 * Two things happen here that cannot happen in a Server Component:
 *  1. Supabase auth cookies are refreshed, which needs a mutable response.
 *  2. An unauthenticated request to a factory route is redirected before any
 *     page renders, so a signed-out visitor never sees dashboard chrome.
 *
 * Being signed in is NOT sufficient for access. Signups are open on this
 * Supabase project, so the allowlist check runs in the page itself against
 * factory_members. Middleware only proves there IS a session, because it cannot
 * query the database cheaply on every request.
 *
 * This file is stripped from client exports along with app/(factory).
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PREFIXES = ["/login", "/auth", "/shared"];
const GUARDED_PREFIXES = ["/dashboard", "/sections"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
  // Without Supabase configured the factory still has to be usable locally,
  // otherwise a fresh clone cannot open the picker at all.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  // getUser, not getSession: it validates the token with Supabase rather than
  // trusting whatever is in the cookie.
  const { data } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const isGuarded = GUARDED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isGuarded && !data.user && !isPublic) {
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    to.searchParams.set("next", pathname);
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  // Skip static assets and the client site's own routes.
  matcher: ["/dashboard/:path*", "/sections/:path*", "/login", "/auth/:path*"],
};
