/**
 * Small fetch helpers shared by every provisioning step.
 *
 * Deno Edge has no git binary and no native image tooling, so everything here is
 * plain HTTPS. That turned out to be enough: a full site push is 4 API calls
 * (measured 4.5s for 204 files), because GitHub's create-tree accepts inline
 * content for text blobs.
 */

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function request<T = unknown>(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 25_000, ...rest } = init;
  const res = await fetch(url, { ...rest, signal: AbortSignal.timeout(timeoutMs) });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      (body as { message?: string; error?: { message?: string } } | null)?.message ??
      (body as { error?: { message?: string } } | null)?.error?.message ??
      `${res.status} ${res.statusText}`;
    throw new HttpError(res.status, body, `${init.method ?? "GET"} ${new URL(url).pathname} -> ${msg}`);
  }
  return body as T;
}

/** Bounded concurrency. GitHub throttles per request, so 8 beat 16 in testing. */
export async function pool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
