"use client";

/** Browser client. Anon key only, so every read is subject to RLS. */
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export const createClient = () => createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
