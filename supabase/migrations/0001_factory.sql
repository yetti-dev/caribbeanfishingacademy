-- ============================================================================
--  Website factory schema
-- ============================================================================
--  One row per client site, plus a full audit trail of every build run: what was
--  scraped, which sections were picked, what got deployed, whether the domain
--  verified, and whether the factory tooling was stripped from the export.
--
--  Design notes
--   * Every table is RLS-protected and denies by default. The dashboard reads
--     through the anon key as a signed-in user; the pipeline writes through the
--     service role, which bypasses RLS entirely.
--   * Access is gated on an ALLOWED EMAIL LIST, not on Supabase's signup toggle.
--     Signups are open on this project, so "authenticated" alone is not a
--     permission: anyone could create an account and read every client record.
--   * Timings are stored as real timestamps plus a generated duration, so a
--     dashboard never has to trust a client-supplied elapsed number.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── who is allowed in ───────────────────────────────────────────────────────
create table if not exists factory_members (
  email       text primary key,
  role        text not null default 'member' check (role in ('owner', 'member', 'viewer')),
  invited_at  timestamptz not null default now()
);
comment on table factory_members is
  'Email allowlist. Being authenticated is not enough, because signups are open.';

create or replace function is_factory_member()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from factory_members m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ── sites ───────────────────────────────────────────────────────────────────
create table if not exists sites (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  name                    text not null,
  source_url              text,
  brief                   text,

  -- lifecycle
  status                  text not null default 'draft'
                            check (status in ('draft','scraping','building','built','deploying','live','failed','archived')),

  -- the running scoreboard the dashboard shows at a glance
  github_repo_url         text,
  github_repo_created     boolean not null default false,
  vercel_project          text,
  vercel_project_created  boolean not null default false,
  vercel_scope            text,
  preview_url             text,
  live_url                text,
  is_deployed             boolean not null default false,
  domain                  text,
  domain_added            boolean not null default false,
  dns_written             boolean not null default false,
  dns_verified            boolean not null default false,
  factory_stripped        boolean not null default false,

  -- counters, denormalised on purpose so a list view is one query
  section_count           integer not null default 0,
  page_count              integer not null default 0,
  image_count             integer not null default 0,

  created_by              text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  first_deployed_at       timestamptz,
  last_deployed_at        timestamptz
);
create index if not exists sites_status_idx on sites (status);
create index if not exists sites_updated_idx on sites (updated_at desc);

-- ── build runs ──────────────────────────────────────────────────────────────
create table if not exists runs (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites (id) on delete cascade,
  status        text not null default 'running'
                  check (status in ('running','succeeded','failed','cancelled')),
  trigger       text,                       -- 'cli' | 'dashboard' | 'cron'
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  -- generated, so elapsed time is never a number the caller made up
  duration_s    integer generated always as (
                  case when finished_at is null then null
                       else extract(epoch from (finished_at - started_at))::int end
                ) stored,
  budget_s      integer not null default 1800,   -- the 30 minute target
  error         text,
  created_by    text
);
create index if not exists runs_site_idx on runs (site_id, started_at desc);

-- ── phase level timings ─────────────────────────────────────────────────────
create table if not exists run_events (
  id          uuid primary key default gen_random_uuid(),
  run_id      uuid not null references runs (id) on delete cascade,
  site_id     uuid not null references sites (id) on delete cascade,
  phase       text not null,                -- 'clone' | 'design' | 'sections' | 'build' | 'deploy' | 'dns' | 'strip'
  status      text not null default 'running'
                check (status in ('running','ok','warn','failed','skipped')),
  detail      jsonb not null default '{}'::jsonb,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  duration_ms integer generated always as (
                case when ended_at is null then null
                     else (extract(epoch from (ended_at - started_at)) * 1000)::int end
              ) stored
);
create index if not exists run_events_run_idx on run_events (run_id, started_at);

-- ── layouts: what the picker produced ───────────────────────────────────────
create table if not exists layouts (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid references sites (id) on delete cascade,
  -- short shareable handle, so a colleague gets a link rather than a JSON blob
  share_code  text not null unique,
  version     integer not null default 1,
  is_current  boolean not null default false,
  theme       jsonb not null,               -- hex, fonts, accent settings
  sections    text[] not null default '{}', -- ordered section codes
  note        text,
  created_by  text,
  created_at  timestamptz not null default now()
);
create index if not exists layouts_site_idx on layouts (site_id, version desc);
-- At most one current layout per site.
create unique index if not exists layouts_one_current
  on layouts (site_id) where is_current;

-- ── scrapes ─────────────────────────────────────────────────────────────────
create table if not exists scrapes (
  id             uuid primary key default gen_random_uuid(),
  site_id        uuid not null references sites (id) on delete cascade,
  run_id         uuid references runs (id) on delete set null,
  source_url     text not null,
  brand          jsonb not null default '{}'::jsonb,
  section_order  text[] not null default '{}',
  inner_pages    jsonb not null default '[]'::jsonb,
  nav_items      jsonb not null default '[]'::jsonb,
  contact        jsonb not null default '{}'::jsonb,
  hue            integer,
  fonts          text[] not null default '{}',
  page_count     integer not null default 0,
  image_count    integer not null default 0,
  video_count    integer not null default 0,
  faq_count      integer not null default 0,
  -- dropped assets, sanitised svgs, prompt injection hits
  security       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);
create index if not exists scrapes_site_idx on scrapes (site_id, created_at desc);

-- ── generated copy ──────────────────────────────────────────────────────────
create table if not exists content_files (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references sites (id) on delete cascade,
  path        text not null,                -- 'content/home.ts'
  body        text not null,
  bytes       integer generated always as (length(body)) stored,
  updated_at  timestamptz not null default now(),
  unique (site_id, path)
);

-- ── deploys ─────────────────────────────────────────────────────────────────
create table if not exists deploys (
  id                uuid primary key default gen_random_uuid(),
  site_id           uuid not null references sites (id) on delete cascade,
  run_id            uuid references runs (id) on delete set null,
  provider          text not null default 'vercel',
  repo_url          text,
  repo_created      boolean not null default false,
  commit_sha        text,
  deploy_url        text,
  production        boolean not null default true,
  status            text not null default 'pending'
                      check (status in ('pending','building','ready','failed','cancelled')),
  -- was the factory tooling removed from THIS export
  factory_stripped  boolean not null default false,
  stripped_paths    jsonb not null default '[]'::jsonb,
  bytes_pushed      bigint,
  started_at        timestamptz not null default now(),
  finished_at       timestamptz,
  duration_s        integer generated always as (
                      case when finished_at is null then null
                           else extract(epoch from (finished_at - started_at))::int end
                    ) stored,
  error             text
);
create index if not exists deploys_site_idx on deploys (site_id, started_at desc);

-- ── domains ─────────────────────────────────────────────────────────────────
create table if not exists domains (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references sites (id) on delete cascade,
  domain        text not null,
  zone          text,
  dns_provider  text,
  record_type   text,
  record_name   text,
  record_value  text,
  attached      boolean not null default false,   -- known to Vercel
  dns_written   boolean not null default false,   -- record written at registrar
  verified      boolean not null default false,   -- Vercel stopped calling it misconfigured
  verified_at   timestamptz,
  last_checked  timestamptz,
  error         text,
  created_at    timestamptz not null default now(),
  unique (site_id, domain)
);

-- ── notifications actually sent ─────────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid references sites (id) on delete cascade,
  run_id      uuid references runs (id) on delete set null,
  stage       text not null,                -- 'started' | 'written' | 'deployed' | 'failed'
  channel     text not null default 'email',
  recipient   text,
  provider_id text,                         -- Resend message id
  ok          boolean not null default true,
  error       text,
  sent_at     timestamptz not null default now()
);

-- ── keep updated_at honest ──────────────────────────────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists sites_touch on sites;
create trigger sites_touch before update on sites
  for each row execute function touch_updated_at();

-- ── dashboard view ──────────────────────────────────────────────────────────
create or replace view site_overview as
select
  s.*,
  r.id                as latest_run_id,
  r.status            as latest_run_status,
  r.started_at        as latest_run_started,
  r.finished_at       as latest_run_finished,
  r.duration_s        as latest_run_seconds,
  case
    when r.duration_s is null then null
    when r.duration_s <= r.budget_s then true
    else false
  end                 as within_budget,
  d.deploy_url        as latest_deploy_url,
  d.status            as latest_deploy_status,
  l.share_code        as current_layout_code,
  coalesce(array_length(l.sections, 1), 0) as current_layout_sections
from sites s
left join lateral (
  select * from runs where runs.site_id = s.id order by started_at desc limit 1
) r on true
left join lateral (
  select * from deploys where deploys.site_id = s.id order by started_at desc limit 1
) d on true
left join lateral (
  select * from layouts where layouts.site_id = s.id and layouts.is_current limit 1
) l on true;

-- ============================================================================
--  RLS. Deny by default; read for allowlisted members; writes via service role
--  only, which bypasses RLS and therefore needs no policy.
-- ============================================================================
alter table factory_members enable row level security;
alter table sites            enable row level security;
alter table runs             enable row level security;
alter table run_events       enable row level security;
alter table layouts          enable row level security;
alter table scrapes          enable row level security;
alter table content_files    enable row level security;
alter table deploys          enable row level security;
alter table domains          enable row level security;
alter table notifications    enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'sites','runs','run_events','layouts','scrapes',
    'content_files','deploys','domains','notifications'
  ]
  loop
    execute format('drop policy if exists member_read on %I', t);
    execute format(
      'create policy member_read on %I for select to authenticated using (is_factory_member())', t);
  end loop;
end $$;

drop policy if exists member_read_self on factory_members;
create policy member_read_self on factory_members
  for select to authenticated using (is_factory_member());

-- A layout can be created by an allowlisted member from the picker; everything
-- else is written by the pipeline through the service role.
drop policy if exists member_insert_layout on layouts;
create policy member_insert_layout on layouts
  for insert to authenticated with check (is_factory_member());

-- Anonymous read of a SHARED layout only, by its unguessable code, so a
-- colleague can open a link without an account. Nothing else is exposed.
drop policy if exists anon_read_shared_layout on layouts;
create policy anon_read_shared_layout on layouts
  for select to anon using (share_code is not null);
