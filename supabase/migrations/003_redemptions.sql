-- Create redemptions table for Star Store purchases
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  stars_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ
);

-- Index for querying by child
CREATE INDEX IF NOT EXISTS idx_redemptions_child_id ON redemptions(child_id);

-- Index for querying pending redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status) WHERE status = 'pending';

-- RLS policies
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Parents can see redemptions for their children
CREATE POLICY "Parents can view their children's redemptions"
  ON redemptions FOR SELECT
  USING (
    child_id IN (
      SELECT id FROM children WHERE parent_id = auth.uid()
    )
  );

-- Children can create redemptions (via authenticated parent session)
CREATE POLICY "Can create redemptions for children"
  ON redemptions FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT id FROM children WHERE parent_id = auth.uid()
    )
  );

-- Parents can update redemption status
CREATE POLICY "Parents can update redemption status"
  ON redemptions FOR UPDATE
  USING (
    child_id IN (
      SELECT id FROM children WHERE parent_id = auth.uid()
    )
  );
