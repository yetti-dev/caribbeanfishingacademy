import type { Metadata } from "next";
import { LoginForm } from "@/components/factory/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <LoginForm next={next ?? "/dashboard"} error={error} />;
}
