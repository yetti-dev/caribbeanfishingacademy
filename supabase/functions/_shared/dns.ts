/**
 * DNS provider adapters. One interface so switching registrar is config, not a
 * rewrite. GoDaddy first because that is where the zones live.
 */
import { request } from "./http.ts";

export type DnsRecord = { zone: string; name: string; type: "A" | "CNAME" | "TXT"; value: string; ttl?: number };

export interface DnsProvider {
  name: string;
  ready(): boolean;
  upsert(rec: DnsRecord): Promise<void>;
  read(rec: Omit<DnsRecord, "value">): Promise<{ data: string; ttl?: number }[]>;
}

const get = (k: string) => Deno.env.get(k) ?? "";

/**
 * GoDaddy. Two auth schemes are live: a newer single Personal Access Token used
 * as Bearer, and the classic pair sent as `sso-key KEY:SECRET`. Accept either,
 * token first, because both exist in the wild for the same account.
 */
export const godaddy: DnsProvider = {
  name: "godaddy",
  ready: () => Boolean(get("GODADDY_TOKEN") || (get("GODADDY_API_KEY") && get("GODADDY_API_SECRET"))),
  async upsert({ zone, name, type, value, ttl = 600 }) {
    const url = `https://api.godaddy.com/v1/domains/${encodeURIComponent(zone)}/records/${type}/${encodeURIComponent(name)}`;

    /*
     * TXT records MUST be merged, never replaced.
     *
     * GoDaddy's PUT overwrites every record of a (type, name) pair. For A and
     * CNAME that is what we want, and it makes a retry a no-op. For TXT it is
     * destructive: _vercel.<zone> holds one vc-domain-verify record per
     * subdomain, and this zone already had THIRTEEN. A blind PUT would have
     * deleted the verification for thirteen live sites.
     */
    if (type === "TXT") {
      let existing: { data: string; ttl?: number }[] = [];
      try {
        existing = await request<{ data: string; ttl?: number }[]>(url, { headers: authHeaders() });
      } catch { existing = []; }
      const merged = existing.map((x) => ({ data: x.data, ttl: Math.max(x.ttl ?? 600, 600) }));
      if (!merged.some((x) => x.data === value)) merged.push({ data: value, ttl: Math.max(ttl, 600) });
      await request(url, { method: "PUT", headers: authHeaders(), body: JSON.stringify(merged) });
      return;
    }

    await request(url, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify([{ data: value, ttl: Math.max(ttl, 600) }]),
    });
  },
  async read({ zone, name, type }) {
    return await request(
      `https://api.godaddy.com/v1/domains/${encodeURIComponent(zone)}/records/${type}/${encodeURIComponent(name)}`,
      { headers: authHeaders() },
    );
  },
};

function authHeaders() {
  const token = get("GODADDY_TOKEN");
  return {
    Authorization: token
      ? `Bearer ${token}`
      : `sso-key ${get("GODADDY_API_KEY")}:${get("GODADDY_API_SECRET")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export const cloudflare: DnsProvider = {
  name: "cloudflare",
  ready: () => Boolean(get("CLOUDFLARE_API_TOKEN")),
  async upsert({ zone, name, type, value, ttl = 600 }) {
    const h = { Authorization: `Bearer ${get("CLOUDFLARE_API_TOKEN")}`, "Content-Type": "application/json" };
    const zres = await request<{ result: { id: string }[] }>(
      `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(zone)}`,
      { headers: h },
    );
    const zoneId = zres.result?.[0]?.id;
    if (!zoneId) throw new Error(`cloudflare: zone ${zone} not on this token`);
    const fqdn = name === "@" ? zone : `${name}.${zone}`;
    const existing = await request<{ result: { id: string }[] }>(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=${type}&name=${encodeURIComponent(fqdn)}`,
      { headers: h },
    );
    const id = existing.result?.[0]?.id;
    // proxied must stay false: an orange-cloud record breaks Vercel verification.
    const body = JSON.stringify({ type, name: fqdn, content: value, ttl, proxied: false });
    await request(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records${id ? `/${id}` : ""}`,
      { method: id ? "PUT" : "POST", headers: h, body },
    );
  },
  async read({ zone, name, type }) {
    const h = { Authorization: `Bearer ${get("CLOUDFLARE_API_TOKEN")}` };
    const zres = await request<{ result: { id: string }[] }>(
      `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(zone)}`,
      { headers: h },
    );
    const zoneId = zres.result?.[0]?.id;
    if (!zoneId) return [];
    const fqdn = name === "@" ? zone : `${name}.${zone}`;
    const r = await request<{ result: { content: string; ttl: number }[] }>(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=${type}&name=${encodeURIComponent(fqdn)}`,
      { headers: h },
    );
    return (r.result ?? []).map((x) => ({ data: x.content, ttl: x.ttl }));
  },
};

export function pickProvider(): DnsProvider | null {
  const explicit = (Deno.env.get("DNS_PROVIDER") ?? "").toLowerCase();
  const all: { [k: string]: DnsProvider } = { godaddy, cloudflare };
  if (explicit) {
    const p = all[explicit];
    if (!p) throw new Error(`DNS_PROVIDER="${explicit}" unknown`);
    return p;
  }
  return [godaddy, cloudflare].find((p) => p.ready()) ?? null;
}
