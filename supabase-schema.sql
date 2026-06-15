-- =============================================
-- CAMPUS CART — SUPABASE SCHEMA
-- Run this in your Supabase SQL editor
-- =============================================

-- PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  student_id text unique,
  department text,
  semester text,
  avatar_url text,
  rating numeric(3,2) default 0,
  total_sales int default 0,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- LISTINGS
create table listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(10,2) not null,
  category text check (category in ('books','digital','electronics','clothing','accessories','other')) not null,
  status text check (status in ('available','sold','reserved')) default 'available',
  condition text check (condition in ('new','good','fair','poor')) default 'good',
  images text[] default '{}',
  meetup_spot text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- CONVERSATIONS
create table conversations (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade,
  buyer_id uuid references profiles(id) on delete cascade,
  seller_id uuid references profiles(id) on delete cascade,
  updated_at timestamptz default now(),
  unique(listing_id, buyer_id)
);

-- MESSAGES
create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- NOTICES (admin posts these)
create table notices (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text,
  type text check (type in ('urgent','exam','fee','event','general')) default 'general',
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table listings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notices enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);

-- Listings: anyone can read available, only seller can modify
create policy "Public listings" on listings for select using (true);
create policy "Create listing" on listings for insert with check (auth.uid() = seller_id);
create policy "Update own listing" on listings for update using (auth.uid() = seller_id);
create policy "Delete own listing" on listings for delete using (auth.uid() = seller_id);

-- Conversations: only buyer and seller can see
create policy "Own conversations" on conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Create conversation" on conversations for insert
  with check (auth.uid() = buyer_id);

-- Messages: only conversation participants
create policy "Conversation messages" on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
create policy "Send message" on messages for insert
  with check (auth.uid() = sender_id);

-- Notices: everyone can read
create policy "Public notices" on notices for select using (true);

-- =============================================
-- REALTIME (enable for live chat)
-- =============================================
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;

-- =============================================
-- FUNCTION: auto-update conversations.updated_at on new message
-- =============================================
create or replace function update_conversation_timestamp()
returns trigger as $$
begin
  update conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

create trigger on_new_message
  after insert on messages
  for each row execute function update_conversation_timestamp();

-- =============================================
-- SEED: sample notices
-- =============================================
insert into notices (title, body, type) values
  ('Mid-exam schedule released', 'Check your portal for the full timetable. Exams start June 9.', 'exam'),
  ('Fee submission deadline', 'Last date for fee submission is June 10, 2026.', 'fee'),
  ('Library closed Friday', 'Library will remain closed this Friday for maintenance.', 'general'),
  ('Hackathon registrations open', 'CUST Hackathon 2026 — register before May 30.', 'event');
