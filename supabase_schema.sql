-- Create the table for storing valentine requests
create table requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  recipient_name text not null,
  sender_name text not null,
  evasion_mode text not null default 'run_away' -- Options: 'run_away', 'teleport', 'ghost', 'mirror', 'shake'
);

-- Enable Row Level Security
alter table requests enable row level security;

-- Allow anyone (anon) to create a request
create policy "Enable insert for anon users" on requests 
for insert 
with check (true);

-- Allow anyone to read requests (to view the page)
create policy "Enable read for anon users" on requests 
for select 
using (true);
