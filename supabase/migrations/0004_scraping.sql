-- ============================================================================
--  Scraping queue
-- ============================================================================
--  Same reasoning as provisioning: ONE page per invocation. A 12 page crawl takes
--  ~40s locally, which is too long for a single Edge Function call, and a timeout
--  mid-crawl would lose every page already fetched.
--
--  Pages are discovered as we go: each fetch enqueues the internal links it finds,
--  up to a per-site cap, so the crawl is a breadth-first walk spread across ticks.
-- ============================================================================

create table if not exists scrape_pages (
  id              uuid primary key default gen_random_uuid(),
  site_id         uuid not null references sites (id) on delete cascade,
  url             text not null,
  path            text,
  depth           integer not null default 0,
  discovered_from text,
  status          text not null default 'pending'
                    check (status in ('pending','running','done','failed','skipped')),
  attempts        integer not null default 0,
  max_attempts    integer not null default 3,
  next_attempt_at timestamptz not null default now(),
  locked_by       text,
  lease_until     timestamptz,

  -- extracted content
  http_status     integer,
  title           text,
  description     text,
  headings        jsonb not null default '[]'::jsonb,   -- [{level, text}]
  paragraphs      jsonb not null default '[]'::jsonb,
  ctas            jsonb not null default '[]'::jsonb,
  links           jsonb not null default '[]'::jsonb,   -- internal nav candidates
  faqs            jsonb not null default '[]'::jsonb,   -- [{q, a}]
  contact         jsonb not null default '{}'::jsonb,
  colors          jsonb not null default '[]'::jsonb,
  fonts           text[] not null default '{}',
  image_count     integer not null default 0,
  -- prompt injection markers: this text is read by build agents, so a page that
  -- tries to issue instructions must be visible rather than silently trusted
  injection_flags text[] not null default '{}',
  bytes           integer,
  error           text,
  started_at      timestamptz,
  finished_at     timestamptz,
  duration_ms     integer generated always as (
                    case when finished_at is null or started_at is null then null
                         else (extract(epoch from (finished_at - started_at)) * 1000)::int end
                  ) stored,
  created_at      timestamptz not null default now(),
  -- the same URL found on five pages is one crawl target
  unique (site_id, url)
);
create index if not exists scrape_pages_due_idx
  on scrape_pages (next_attempt_at) where status in ('pending','running');
create index if not exists scrape_pages_site_idx on scrape_pages (site_id, depth);

-- Per-site crawl budget, so a link farm cannot make the crawl unbounded.
alter table sites add column if not exists max_pages  integer not null default 14;
alter table sites add column if not exists max_assets integer not null default 80;

-- ── seed the crawl with the home page ───────────────────────────────────────
create or replace function enqueue_scrape(p_site_id uuid)
returns integer
language plpgsql security definer set search_path = public
as $$
declare src text;
begin
  select source_url into src from sites where id = p_site_id;
  if src is null then raise exception 'site % has no source_url', p_site_id; end if;
  insert into scrape_pages (site_id, url, path, depth)
  values (p_site_id, src, '/', 0)
  on conflict (site_id, url) do nothing;
  update sites set status = 'scraping' where id = p_site_id and status in ('draft','failed');
  return 1;
end $$;

-- ── claim pages, respecting the per-site cap ───────────────────────────────
create or replace function claim_scrape_pages(worker text, batch integer default 3, lease_seconds integer default 120)
returns setof scrape_pages
language plpgsql security definer set search_path = public
as $$
begin
  return query
  with due as (
    select p.id
    from scrape_pages p
    join sites s on s.id = p.site_id
    where p.status = 'pending'
      and p.next_attempt_at <= now()
      and p.attempts < p.max_attempts
      -- stop crawling once the site has enough pages already fetched
      and (select count(*) from scrape_pages d where d.site_id = p.site_id and d.status = 'done') < s.max_pages
    order by p.depth, p.next_attempt_at
    limit batch
    for update of p skip locked
  )
  update scrape_pages u
  set status = 'running', attempts = u.attempts + 1,
      locked_by = worker, lease_until = now() + make_interval(secs => lease_seconds),
      started_at = coalesce(u.started_at, now())
  from due where u.id = due.id
  returning u.*;
end $$;

create or replace function reap_stale_scrape_pages()
returns integer
language sql security definer set search_path = public
as $$
  with r as (
    update scrape_pages
    set status = 'pending', locked_by = null, lease_until = null,
        next_attempt_at = now() + make_interval(secs => 20 * attempts)
    where status = 'running' and lease_until < now()
    returning 1
  ) select count(*)::int from r;
$$;

-- ── crawl progress ──────────────────────────────────────────────────────────
create or replace view scrape_progress as
select
  s.id as site_id, s.slug, s.name, s.source_url, s.max_pages, s.max_assets,
  count(p.id)                                        as pages_seen,
  count(*) filter (where p.status = 'done')           as pages_done,
  count(*) filter (where p.status = 'failed')         as pages_failed,
  count(*) filter (where p.status = 'pending')        as pages_pending,
  coalesce(sum(p.image_count), 0)                    as images_found,
  (select count(*) from assets a where a.site_id = s.id)                          as assets_total,
  (select count(*) from assets a where a.site_id = s.id and a.status = 'stored')  as assets_stored,
  (select array_agg(distinct f) from scrape_pages q, unnest(q.injection_flags) f
     where q.site_id = s.id)                          as injection_flags,
  sum(p.duration_ms)                                 as total_ms
from sites s
left join scrape_pages p on p.site_id = s.id
group by s.id, s.slug, s.name, s.source_url, s.max_pages, s.max_assets;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table scrape_pages enable row level security;
drop policy if exists member_read on scrape_pages;
create policy member_read on scrape_pages
  for select to authenticated using (is_factory_member());

revoke all on function claim_scrape_pages(text, integer, integer) from public, anon, authenticated;
revoke all on function reap_stale_scrape_pages() from public, anon, authenticated;
revoke all on function enqueue_scrape(uuid) from public, anon;
grant execute on function enqueue_scrape(uuid) to authenticated;
