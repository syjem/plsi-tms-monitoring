-- Enable Row Level Security on profiles table
alter table "public"."profiles"
enable row level security;

-- Policy to allow authenticated users to access their own profiles only
create policy "Profiles RLS for ALL"
on "public"."profiles"
as PERMISSIVE
for ALL
to authenticated
using (
    (( SELECT auth.uid() AS uid) = user_id)
) with check (
    (( SELECT auth.uid() AS uid) = user_id)
);


-- Enable Row Level Security on work_logs table
alter table "public"."work_logs"
enable row level security;

create policy "Enable read access for all users"
on "public"."work_logs"
as PERMISSIVE
for SELECT
to authenticated
using (
    true
)

create policy "Enable insert for users based on user_id"
on "public"."work_logs"
as PERMISSIVE
for INSERT
to authenticated
with check (
    (( SELECT auth.uid() AS uid) = user_id)
)

create policy "Enable update for users based on user_id"
on "public"."work_logs"
as PERMISSIVE
for UPDATE
to authenticated
using (
    (( SELECT auth.uid() AS uid) = user_id)
) with check (
    (( SELECT auth.uid() AS uid) = user_id)
)

create policy "Enable delete for users based on user_id"
on "public"."work_logs"
as PERMISSIVE
for DELETE
to authenticated
using (
    (( SELECT auth.uid() AS uid) = user_id)
)


-- Enable Row Level Security on engineers table
alter table "public"."engineers"
enable row level security;

-- Policy to allow authenticated users to access their own data only
create policy "Engineers RLS for ALL"
on "public"."engineers"
as PERMISSIVE
for ALL
to authenticated
using (
    (( SELECT auth.uid() AS uid) = user_id)
) with check (
    (( SELECT auth.uid() AS uid) = user_id)
);
