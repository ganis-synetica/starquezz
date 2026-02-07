-- supabase/seed.sql
-- StarqueZZ Seed Data for Ganis's Family
-- 
-- USAGE:
-- 1. First, sign up in the app to create your parent account
-- 2. Get your parent UUID from Supabase Auth dashboard
-- 3. Replace __PARENT_ID__ with your UUID
-- 4. Run this SQL in Supabase SQL Editor

BEGIN;

-- Ensure parent row exists (won't create auth.users, must sign up first)
-- Replace __PARENT_ID__ with your actual auth.users.id UUID
INSERT INTO public.parents (id, email)
VALUES ('__PARENT_ID__'::uuid, 'ganis@synetica.co')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Bcrypt hash for PIN '1234' (cost 10)
-- Generated with: await bcrypt.hash('1234', 10)
-- Result: $2b$10$hG2G8v8p3wQ2Ue4C6mXxUeB5TtqQJwOeQbqgXQpK3m8y7m3Q5x9rS

-- Children: Zen and Zia
INSERT INTO public.children (id, parent_id, name, avatar, pin_hash, stars)
VALUES
  ('11111111-1111-1111-1111-111111111111', '__PARENT_ID__'::uuid, 'Zen', '🦊', '$2b$10$hG2G8v8p3wQ2Ue4C6mXxUeB5TtqQJwOeQbqgXQpK3m8y7m3Q5x9rS', 0),
  ('22222222-2222-2222-2222-222222222222', '__PARENT_ID__'::uuid, 'Zia', '🦋', '$2b$10$hG2G8v8p3wQ2Ue4C6mXxUeB5TtqQJwOeQbqgXQpK3m8y7m3Q5x9rS', 0)
ON CONFLICT (id) DO NOTHING;

-- Habits for Zen (3 core + 3 bonus)
INSERT INTO public.habits (id, parent_id, child_id, title, description, category, is_core, active)
VALUES
  -- Core habits (must-do)
  ('31111111-1111-1111-1111-111111111111', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '🎹 Practice Piano', '15 minutes', 'learning', true, true),
  ('31111111-1111-1111-1111-111111111112', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '✏️ Writing Exercise', 'Practice letters', 'learning', true, true),
  ('31111111-1111-1111-1111-111111111113', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '📖 Reading Time', '20 minutes', 'learning', true, true),
  -- Bonus habits
  ('31111111-1111-1111-1111-111111111114', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '🛏️ Make Your Bed', NULL, 'helping', false, true),
  ('31111111-1111-1111-1111-111111111115', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '🧹 Tidy Room', NULL, 'helping', false, true),
  ('31111111-1111-1111-1111-111111111116', '__PARENT_ID__'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '🪥 Brush Teeth (morning)', NULL, 'self_care', false, true)
ON CONFLICT (id) DO NOTHING;

-- Habits for Zia (3 core + 3 bonus)
INSERT INTO public.habits (id, parent_id, child_id, title, description, category, is_core, active)
VALUES
  -- Core habits (must-do)
  ('32222222-2222-2222-2222-222222222221', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '🎹 Practice Piano', '15 minutes', 'learning', true, true),
  ('32222222-2222-2222-2222-222222222222', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '✏️ Writing Exercise', 'Practice letters', 'learning', true, true),
  ('32222222-2222-2222-2222-222222222223', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '📖 Reading Time', '20 minutes', 'learning', true, true),
  -- Bonus habits
  ('32222222-2222-2222-2222-222222222224', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '🛏️ Make Your Bed', NULL, 'helping', false, true),
  ('32222222-2222-2222-2222-222222222225', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '🧹 Tidy Room', NULL, 'helping', false, true),
  ('32222222-2222-2222-2222-222222222226', '__PARENT_ID__'::uuid, '22222222-2222-2222-2222-222222222226'::uuid, '🪥 Brush Teeth (morning)', NULL, 'self_care', false, true)
ON CONFLICT (id) DO NOTHING;

-- Rewards (parent-wide, shared by all children)
INSERT INTO public.rewards (id, parent_id, title, description, star_cost, active)
VALUES
  ('40000000-0000-0000-0000-000000000001', '__PARENT_ID__'::uuid, 'Ice Cream Trip 🍦', 'A delicious treat!', 10, true),
  ('40000000-0000-0000-0000-000000000002', '__PARENT_ID__'::uuid, 'Movie Night 🎬', 'Pick any movie!', 25, true),
  ('40000000-0000-0000-0000-000000000003', '__PARENT_ID__'::uuid, 'New Book 📚', 'Choose a fun book', 15, true),
  ('40000000-0000-0000-0000-000000000004', '__PARENT_ID__'::uuid, 'Extra Screen Time 📱', '30 minutes bonus!', 20, true),
  ('40000000-0000-0000-0000-000000000005', '__PARENT_ID__'::uuid, 'Pizza Party 🍕', 'With your favorite toppings!', 50, true)
ON CONFLICT (id) DO NOTHING;

COMMIT;
