create type review_status as enum ('pending', 'approved', 'rejected');

create table reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating smallint not null check (rating between 1 and 5),
  text text not null,
  status review_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

create policy "anon can insert reviews"
  on reviews for insert
  to anon
  with check (true);

create policy "authenticated can select reviews"
  on reviews for select
  to authenticated
  using (true);

create policy "authenticated can update reviews"
  on reviews for update
  to authenticated
  using (true);

-- No select grant for anon: same reasoning as requests — there's no
-- matching select policy, and the public reviews list reads approved rows
-- through the admin client instead.
grant insert on reviews to anon;
grant select, insert, update on reviews to authenticated;
grant select, insert, update on reviews to service_role;
