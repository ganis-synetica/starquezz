-- Add parent PIN support
ALTER TABLE parents ADD COLUMN IF NOT EXISTS pin_hash TEXT;
