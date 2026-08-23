-- ============================================================================
--  Deduplicate assets by content hash
-- ============================================================================
--  Two layers of dedup already existed and neither catches this case:
--
--   1. The Storage PATH is the content hash, so identical bytes overwrite one
--      object. Storage was never duplicated.
--   2. assets is unique on (site_id, source_url), which catches the same URL
--      found on five pages.
--
--  What slipped through: the SAME IMAGE at two different URLs. A WordPress site
--  re-uploading a photo in 2024 and again in 2025 produces two paths, two rows,
--  one object, and the operator sees the same photo twice. Two such pairs already
--  exist in this database.
--
--  Fix: a partial unique index on (site_id, sha256) for STORED rows only, plus a
--  'duplicate' status so the losing row stays visible and still points at the
--  object rather than being deleted. Knowing a source URL was a repeat is useful;
--  silently dropping it is not.
-- ============================================================================

alter table assets drop constraint if exists assets_status_check;
alter table assets add constraint assets_status_check
  check (status in ('discovered', 'stored', 'skipped', 'failed', 'duplicate'));

-- Points at the row this one duplicates, so the UI can say which.
alter table assets add column if not exists duplicate_of uuid references assets (id) on delete set null;

--  Retire existing duplicates before the index goes on, keeping the earliest of
--  each group. Doing this after would just make the index creation fail.
with ranked as (
  select id, site_id, sha256, storage_path, created_at,
         row_number() over (partition by site_id, sha256 order by created_at, id) as rn,
         first_value(id) over (partition by site_id, sha256 order by created_at, id) as keeper
  from assets
  where sha256 is not null and status = 'stored'
)
update assets a
set status = 'duplicate',
    duplicate_of = r.keeper,
    skip_reason = 'identical bytes to an asset already stored'
from ranked r
where a.id = r.id and r.rn > 1;

--  STORED rows only. A 'duplicate' row keeps its hash on purpose, so the index
--  has to exclude it or the row it documents could never be written.
create unique index if not exists assets_unique_content
  on assets (site_id, sha256)
  where sha256 is not null and status = 'stored';

comment on index assets_unique_content is
  'One stored asset per content hash per site. Repeats are marked duplicate and '
  'keep duplicate_of, so a repeated source URL stays visible instead of vanishing.';
