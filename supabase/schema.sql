-- Mumuksha — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable pgvector extension
create extension if not exists vector;

-- 1. Scriptures
create table if not exists scriptures (
  id           serial primary key,
  name         text not null,
  name_ta      text,
  author       text,
  period       text,
  description  text,
  created_at   timestamptz default now()
);

-- 2. Topics (AI-generated clusters)
create table if not exists topics (
  id           serial primary key,
  scripture_id integer references scriptures(id) on delete cascade,
  name         text not null,
  name_ta      text,
  description  text,
  created_at   timestamptz default now()
);

-- 3. Verses
create table if not exists verses (
  id                serial primary key,
  scripture_id      integer references scriptures(id) on delete cascade,
  song_number       integer not null,
  tamil_verse       text not null,
  tamil_explanation text,
  created_at        timestamptz default now(),
  unique(scripture_id, song_number)
);

-- 4. Verse-Topic mapping (many-to-many)
create table if not exists verse_topics (
  id               serial primary key,
  verse_id         integer references verses(id) on delete cascade,
  topic_id         integer references topics(id) on delete cascade,
  confidence_score float default 1.0,
  unique(verse_id, topic_id)
);

-- 5. Embeddings (pgvector for semantic search)
create table if not exists embeddings (
  id         serial primary key,
  verse_id   integer references verses(id) on delete cascade unique,
  embedding  vector(768),  -- Gemini embedding-001 dimension
  created_at timestamptz default now()
);

-- 6. User sessions (for chat history)
create table if not exists chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  query       text not null,
  gemini_resp text,
  sarvam_resp text,
  sources     jsonb,
  mode        text default 'free',
  created_at  timestamptz default now()
);

-- 7. Bookmarks
create table if not exists bookmarks (
  id         serial primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  verse_id   integer references verses(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, verse_id)
);

-- Indexes
create index if not exists idx_verses_scripture on verses(scripture_id);
create index if not exists idx_verse_topics_verse on verse_topics(verse_id);
create index if not exists idx_verse_topics_topic on verse_topics(topic_id);
create index if not exists idx_embeddings_verse on embeddings(verse_id);
create index if not exists idx_chat_sessions_user on chat_sessions(user_id);
create index if not exists idx_bookmarks_user on bookmarks(user_id);

-- Vector similarity search function
create or replace function match_verses(
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (
  verse_id   int,
  similarity float
)
language sql stable
as $$
  select
    e.verse_id,
    1 - (e.embedding <=> query_embedding) as similarity
  from embeddings e
  where 1 - (e.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- Row Level Security
alter table chat_sessions enable row level security;
alter table bookmarks enable row level security;

create policy "Users can see own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can manage own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id);

-- Public read for scriptures, topics, verses
alter table scriptures enable row level security;
alter table topics enable row level security;
alter table verses enable row level security;
alter table verse_topics enable row level security;

create policy "Public read scriptures" on scriptures for select using (true);
create policy "Public read topics" on topics for select using (true);
create policy "Public read verses" on verses for select using (true);
create policy "Public read verse_topics" on verse_topics for select using (true);
