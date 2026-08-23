-- ============================================================================
--  Force-store an individual asset
-- ============================================================================
--  The crawl skips assets by size, and the thresholds are a judgement call: on the
--  first live crawl a 320x200 minimum threw away usable banners. When the operator
--  can see the image and wants it anyway, they should be able to say so per asset
--  rather than us loosening the filter for every site.
--
--  force=true makes the worker bypass the size checks for that one row. It never
--  bypasses the SAFETY checks: magic bytes, executables and SVG sanitising still
--  apply, because those are not preferences.
-- ============================================================================

alter table assets add column if not exists force boolean not null default false;

comment on column assets.force is
  'Operator asked for this asset despite the size filter. Bypasses size checks '
  'only. Magic-byte sniffing, executable refusal and SVG sanitising still apply.';

-- Re-queue one asset for another attempt, optionally forcing it past the filter.
create or replace function retry_asset(p_asset_id uuid, p_force boolean default false)
returns void
language sql security definer set search_path = public
as $$
  update assets
  set status = 'discovered', skip_reason = null, force = p_force
  where id = p_asset_id;
$$;

revoke all on function retry_asset(uuid, boolean) from public, anon;
grant execute on function retry_asset(uuid, boolean) to authenticated;
