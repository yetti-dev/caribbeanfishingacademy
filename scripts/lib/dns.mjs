/**
 * DNS provider adapters.
 *
 * One interface, several registrars, so swapping where a domain lives is a
 * DNS_PROVIDER change in .env and nothing else. Every adapter implements:
 *
 *   name
 *   credentials()        -> [env keys it needs]
 *   upsert(env, {zone, name, type, value, ttl}) -> Promise<void>   (idempotent)
 *   read(env, {zone, name, type})               -> Promise<record[]>
 *
 * `name` is the subdomain relative to the zone: "@" for the apex, "www" for
 * www.example.com. Adapters translate that to whatever their API expects.
 */

const j = async (res, what) => {
  const text = await res.text();
  if (!res.ok) throw new Error(`${what} failed ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
};

/* ── GoDaddy ────────────────────────────────────────────────────────────────
 * As of April 2026 the DNS API needs only 1 domain on the account (was 10+).
 * Auth header is `sso-key KEY:SECRET`. PUT replaces every record of a
 * (type, name) pair, which makes upsert naturally idempotent.
 * Docs: https://developer.godaddy.com/doc/endpoint/domains
 */
const godaddy = {
  name: "godaddy",
  /*
   * Two auth schemes are live. GODADDY_TOKEN is a newer single Personal Access
   * Token used as `Bearer`; the classic developer key is a pair sent as
   * `sso-key KEY:SECRET`. Either is accepted, token first.
   */
  credentials: () => ["GODADDY_TOKEN"],
  hasCreds: (env) => Boolean(env.GODADDY_TOKEN || (env.GODADDY_API_KEY && env.GODADDY_API_SECRET)),
  headers: (env) => ({
    Authorization: env.GODADDY_TOKEN
      ? `Bearer ${env.GODADDY_TOKEN}`
      : `sso-key ${env.GODADDY_API_KEY}:${env.GODADDY_API_SECRET}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }),
  async read(env, { zone, name, type }) {
    const res = await fetch(
      `https://api.godaddy.com/v1/domains/${encodeURIComponent(zone)}/records/${type}/${encodeURIComponent(name)}`,
      { headers: godaddy.headers(env) },
    );
    if (res.status === 404) return [];
    return (await j(res, "godaddy read")) || [];
  },
  async upsert(env, { zone, name, type, value, ttl = 600 }) {
    const res = await fetch(
      `https://api.godaddy.com/v1/domains/${encodeURIComponent(zone)}/records/${type}/${encodeURIComponent(name)}`,
      {
        method: "PUT",
        headers: godaddy.headers(env),
        body: JSON.stringify([{ data: value, ttl: Math.max(ttl, 600) }]),
      },
    );
    await j(res, "godaddy upsert");
  },
};

/* ── Cloudflare ─────────────────────────────────────────────────────────────
 * Token scoped to Zone:DNS:Edit. Needs a zone-id lookup first.
 * proxied:false matters — an orange-cloud record breaks Vercel's verification.
 */
const cloudflare = {
  name: "cloudflare",
  credentials: () => ["CLOUDFLARE_API_TOKEN"],
  headers: (env) => ({ Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" }),
  async zoneId(env, zone) {
    const r = await j(
      await fetch(`https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(zone)}`, { headers: cloudflare.headers(env) }),
      "cloudflare zone lookup",
    );
    const id = r.result?.[0]?.id;
    if (!id) throw new Error(`cloudflare: zone ${zone} not found on this token`);
    return id;
  },
  fqdn: (zone, name) => (name === "@" ? zone : `${name}.${zone}`),
  async read(env, { zone, name, type }) {
    const id = await cloudflare.zoneId(env, zone);
    const r = await j(
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${id}/dns_records?type=${type}&name=${encodeURIComponent(cloudflare.fqdn(zone, name))}`,
        { headers: cloudflare.headers(env) },
      ),
      "cloudflare read",
    );
    return r.result || [];
  },
  async upsert(env, { zone, name, type, value, ttl = 600 }) {
    const id = await cloudflare.zoneId(env, zone);
    const existing = await cloudflare.read(env, { zone, name, type });
    const body = JSON.stringify({ type, name: cloudflare.fqdn(zone, name), content: value, ttl, proxied: false });
    const url = existing[0]
      ? `https://api.cloudflare.com/client/v4/zones/${id}/dns_records/${existing[0].id}`
      : `https://api.cloudflare.com/client/v4/zones/${id}/dns_records`;
    await j(await fetch(url, { method: existing[0] ? "PUT" : "POST", headers: cloudflare.headers(env), body }), "cloudflare upsert");
  },
};

/* ── Vercel-hosted DNS ──────────────────────────────────────────────────────
 * Only works once the domain's nameservers are delegated to Vercel. Uses the
 * token already in .env, so no extra credential.
 */
const vercelDns = {
  name: "vercel",
  credentials: () => ["VERCEL_TOKEN"],
  headers: (env) => ({ Authorization: `Bearer ${env.VERCEL_TOKEN}`, "Content-Type": "application/json" }),
  team: (env) => (env.VERCEL_TEAM_ID ? `?teamId=${env.VERCEL_TEAM_ID}` : ""),
  async read(env, { zone, name, type }) {
    const r = await j(
      await fetch(`https://api.vercel.com/v4/domains/${encodeURIComponent(zone)}/records${vercelDns.team(env)}`, {
        headers: vercelDns.headers(env),
      }),
      "vercel dns read",
    );
    const want = name === "@" ? "" : name;
    return (r.records || []).filter((x) => x.type === type && (x.name || "") === want);
  },
  async upsert(env, { zone, name, type, value, ttl = 600 }) {
    for (const old of await vercelDns.read(env, { zone, name, type })) {
      await fetch(`https://api.vercel.com/v2/domains/${encodeURIComponent(zone)}/records/${old.id}${vercelDns.team(env)}`, {
        method: "DELETE",
        headers: vercelDns.headers(env),
      });
    }
    await j(
      await fetch(`https://api.vercel.com/v2/domains/${encodeURIComponent(zone)}/records${vercelDns.team(env)}`, {
        method: "POST",
        headers: vercelDns.headers(env),
        body: JSON.stringify({ name: name === "@" ? "" : name, type, value, ttl }),
      }),
      "vercel dns upsert",
    );
  },
};

/* ── Namecheap ──────────────────────────────────────────────────────────────
 * Namecheap's API has no per-record write: setHosts REPLACES the whole zone,
 * so we always read every record first and re-post the merged set. It also
 * requires the calling IP to be allowlisted in their dashboard.
 */
const namecheap = {
  name: "namecheap",
  credentials: () => ["NAMECHEAP_API_USER", "NAMECHEAP_API_KEY", "NAMECHEAP_CLIENT_IP"],
  url: (env, command, extra = {}) => {
    const p = new URLSearchParams({
      ApiUser: env.NAMECHEAP_API_USER,
      ApiKey: env.NAMECHEAP_API_KEY,
      UserName: env.NAMECHEAP_API_USER,
      ClientIp: env.NAMECHEAP_CLIENT_IP,
      Command: command,
      ...extra,
    });
    return `https://api.namecheap.com/xml.response?${p}`;
  },
  split: (zone) => {
    const parts = zone.split(".");
    return { SLD: parts.slice(0, -1).join("."), TLD: parts.at(-1) };
  },
  async read(env, { zone, name, type }) {
    const { SLD, TLD } = namecheap.split(zone);
    const xml = await (await fetch(namecheap.url(env, "namecheap.domains.dns.getHosts", { SLD, TLD }))).text();
    const all = [...xml.matchAll(/<host\b[^>]*>/gi)].map((m) => {
      const attr = (k) => (m[0].match(new RegExp(`${k}="([^"]*)"`, "i")) || [])[1] || "";
      return { name: attr("Name"), type: attr("Type"), value: attr("Address"), ttl: attr("TTL") || "600" };
    });
    if (!name && !type) return all;
    return all.filter((r) => r.type === type && r.name === (name === "@" ? "@" : name));
  },
  async upsert(env, { zone, name, type, value, ttl = 600 }) {
    const { SLD, TLD } = namecheap.split(zone);
    const keep = (await namecheap.read(env, {})).filter((r) => !(r.type === type && r.name === name));
    const merged = [...keep, { name, type, value, ttl: String(ttl) }];
    const extra = { SLD, TLD };
    merged.forEach((r, i) => {
      extra[`HostName${i + 1}`] = r.name;
      extra[`RecordType${i + 1}`] = r.type;
      extra[`Address${i + 1}`] = r.value;
      extra[`TTL${i + 1}`] = r.ttl;
    });
    const xml = await (await fetch(namecheap.url(env, "namecheap.domains.dns.setHosts", extra), { method: "POST" })).text();
    if (/<Errors>\s*<Error/i.test(xml)) throw new Error(`namecheap setHosts failed: ${xml.slice(0, 300)}`);
  },
};

export const providers = { godaddy, cloudflare, vercel: vercelDns, namecheap };

/** An adapter may accept more than one credential shape, so ask it. */
export function hasCredentials(provider, env) {
  return provider.hasCreds ? provider.hasCreds(env) : provider.credentials().every((k) => env[k]);
}

export function pickProvider(env) {
  const explicit = env.DNS_PROVIDER?.trim().toLowerCase();
  if (explicit) {
    const p = providers[explicit];
    if (!p) throw new Error(`DNS_PROVIDER="${explicit}" unknown. One of: ${Object.keys(providers).join(", ")}`);
    return p;
  }
  // No explicit choice: use whichever provider's credentials are actually present.
  for (const p of [godaddy, cloudflare, namecheap, vercelDns]) {
    if (hasCredentials(p, env)) return p;
  }
  return null;
}
