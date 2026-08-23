-- ============================================================================
--  Fix: anonymous layout sharing must not expose the whole table
-- ============================================================================
--  0001 shipped this policy:
--
--    create policy anon_read_shared_layout on layouts
--      for select to anon using (share_code is not null);
--
--  share_code is NOT NULL, so the predicate is always true. That granted
--  anonymous read of EVERY layout, not just one that had been shared. RLS cannot
--  express "the caller must filter by share_code", because a policy sees the row,
--  never the query.
--
--  The fix is a security definer function that takes the code as an argument.
--  Knowing an unguessable code returns exactly one layout; knowing nothing
--  returns nothing, and there is no way to enumerate.
-- ============================================================================

drop policy if exists anon_read_shared_layout on layouts;

create or replace function layout_by_share_code(code text)
returns table (
  share_code text,
  version    integer,
  theme      jsonb,
  sections   text[],
  note       text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select l.share_code, l.version, l.theme, l.sections, l.note, l.created_at
  from layouts l
  where l.share_code = code
  limit 1;
$$;

comment on function layout_by_share_code(text) is
  'Read one shared layout by its code. Replaces an anon SELECT policy that, '
  'because share_code is NOT NULL, exposed every row. Returns no site_id or '
  'created_by, so a shared link reveals only the look, not who or what it is for.';

-- Callable without an account, which is the point of a share link.
revoke all on function layout_by_share_code(text) from public;
grant execute on function layout_by_share_code(text) to anon, authenticated;

-- Longer codes: 8 chars is ~2.8e14 combinations, but these are shared in chat
-- and never rate limited by us, so make guessing pointless rather than merely
-- unlikely.
alter table layouts
  add constraint layouts_share_code_len check (length(share_code) >= 12) not valid;
