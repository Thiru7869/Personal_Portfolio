-- ============================================================
-- SUPABASE SCHEMA — Thiru's Portfolio
-- ------------------------------------------------------------
-- Run this once in the Supabase SQL Editor (Dashboard → SQL).
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE.
--
-- Tables
--   contact_messages  — archived contact-form submissions
--   ratings           — visitor portfolio ratings (1–5)
--   analytics_events  — first-party events for Portfolio Insights
--
-- Security model: row-level security is ON for every table and
-- NO public policies are created. Only the service-role key
-- (used exclusively by the Next.js API routes on the server)
-- can read or write. Even a leaked anon key exposes nothing.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- contact_messages ----------
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 100),
  email         text not null check (char_length(email) <= 150),
  subject       text not null check (char_length(subject) <= 150),
  message       text not null check (char_length(message) <= 3000),
  delivered_via text not null default 'none',
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- ---------- ratings ----------
create table if not exists public.ratings (
  id         uuid primary key default gen_random_uuid(),
  score      integer not null check (score between 1 and 5),
  feedback   text check (char_length(feedback) <= 300),
  created_at timestamptz not null default now()
);

alter table public.ratings enable row level security;

-- ---------- newsletter_subscribers ----------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique check (char_length(email) <= 150),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- ---------- analytics_events ----------
create table if not exists public.analytics_events (
  id         uuid primary key default gen_random_uuid(),
  event_type text not null,
  path       text,
  slug       text,
  country    text,
  device     text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

create index if not exists analytics_events_type_idx
  on public.analytics_events (event_type, created_at desc);

-- ============================================================
-- Notes
-- ------------------------------------------------------------
-- * No policies are defined on purpose: with RLS enabled and no
--   policies, anon/authenticated roles are denied everything.
--   The API routes use the service-role key, which bypasses RLS.
-- * The admin signs in through Supabase Auth; create that user
--   in Dashboard → Authentication → Users → "Add user", and put
--   the same email in the ADMIN_EMAIL environment variable.
-- * To reset analytics:      truncate public.analytics_events;
-- * To clear test ratings:   truncate public.ratings;
-- ============================================================
