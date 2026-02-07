-- StarqueZZ Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parents table (uses Supabase Auth)
CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  avatar TEXT DEFAULT '🦊',
  stars INTEGER DEFAULT 0,
  theme JSONB DEFAULT '{"name": "default", "primary": "#FF6B35", "secondary": "#FFE66D", "accent": "#7B68EE"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('learning', 'helping', 'self_care', 'growth')),
  is_core BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT CHECK (approved_by IN ('parent', 'auto')),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  stars_earned INTEGER DEFAULT 0,
  UNIQUE(habit_id, child_id, completed_date)
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  star_cost INTEGER NOT NULL CHECK (star_cost > 0),
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  stars_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ
);

-- Weekly streaks view
CREATE OR REPLACE VIEW weekly_streaks AS
SELECT 
  c.child_id,
  DATE_TRUNC('week', c.completed_date)::DATE as week_start,
  COUNT(DISTINCT c.completed_date) FILTER (WHERE h.is_core AND c.approved_at IS NOT NULL) as core_days_completed,
  SUM(c.stars_earned) as total_stars
FROM habit_completions c
JOIN habits h ON c.habit_id = h.id
GROUP BY c.child_id, DATE_TRUNC('week', c.completed_date);

-- Row Level Security Policies

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Parents can only see their own data
CREATE POLICY "Parents see own data" ON parents
  FOR ALL USING (auth.uid() = id);

-- Parents can see their children
CREATE POLICY "Parents see own children" ON children
  FOR ALL USING (parent_id = auth.uid());

-- Parents can manage habits for their children
CREATE POLICY "Parents manage habits" ON habits
  FOR ALL USING (parent_id = auth.uid());

-- Parents can see completions for their children's habits
CREATE POLICY "Parents see completions" ON habit_completions
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Parents can manage their rewards
CREATE POLICY "Parents manage rewards" ON rewards
  FOR ALL USING (parent_id = auth.uid());

-- Parents can see redemptions for their children
CREATE POLICY "Parents see redemptions" ON redemptions
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_habits_child ON habits(child_id);
CREATE INDEX IF NOT EXISTS idx_completions_child_date ON habit_completions(child_id, completed_date);
CREATE INDEX IF NOT EXISTS idx_redemptions_child ON redemptions(child_id);

-- Function to auto-approve old completions
CREATE OR REPLACE FUNCTION auto_approve_completions()
RETURNS void AS $$
BEGIN
  UPDATE habit_completions
  SET approved_at = NOW(),
      approved_by = 'auto',
      stars_earned = 1
  WHERE approved_at IS NULL
    AND rejected_at IS NULL
    AND completed_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
