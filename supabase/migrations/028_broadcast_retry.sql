-- ============================================================
-- Broadcast auto-retry capabilities for ecosystem errors
-- ============================================================

-- Add tracking columns for retries
ALTER TABLE broadcast_recipients
  ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_ecosystem_error BOOLEAN NOT NULL DEFAULT FALSE;

-- Update the CHECK constraint for status to include 'retry_pending'
ALTER TABLE broadcast_recipients DROP CONSTRAINT IF EXISTS broadcasts_recipients_status_check;
ALTER TABLE broadcast_recipients DROP CONSTRAINT IF EXISTS broadcast_recipients_status_check; -- Drop both potential names just in case
ALTER TABLE broadcast_recipients
  ADD CONSTRAINT broadcast_recipients_status_check
  CHECK (status IN ('pending', 'retry_pending', 'sent', 'delivered', 'read', 'replied', 'failed'));

-- Index for the cron job to quickly find due retries
CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_retry
  ON broadcast_recipients (next_retry_at)
  WHERE next_retry_at IS NOT NULL AND status = 'retry_pending';

-- Update the _bcast_cols_for_status to count retry_pending as failed
CREATE OR REPLACE FUNCTION public._bcast_cols_for_status(s TEXT)
RETURNS TEXT[] AS $$
BEGIN
  -- 'pending' contributes to nothing.
  IF s = 'pending' THEN RETURN ARRAY[]::TEXT[]; END IF;
  IF s = 'sent'      THEN RETURN ARRAY['sent_count']; END IF;
  IF s = 'delivered' THEN RETURN ARRAY['sent_count','delivered_count']; END IF;
  IF s = 'read'      THEN RETURN ARRAY['sent_count','delivered_count','read_count']; END IF;
  IF s = 'replied'   THEN RETURN ARRAY['sent_count','delivered_count','read_count','replied_count']; END IF;
  IF s = 'failed'    THEN RETURN ARRAY['failed_count']; END IF;
  IF s = 'retry_pending' THEN RETURN ARRAY['failed_count']; END IF;
  RETURN ARRAY[]::TEXT[];
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Recompute function needs to include retry_pending in failed_count
CREATE OR REPLACE FUNCTION public.recompute_broadcast_counts(bid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE broadcasts b SET
    sent_count      = agg.sent_count,
    delivered_count = agg.delivered_count,
    read_count      = agg.read_count,
    replied_count   = agg.replied_count,
    failed_count    = agg.failed_count,
    updated_at      = NOW()
  FROM (
    SELECT
      COUNT(*) FILTER (WHERE status IN ('sent','delivered','read','replied')) AS sent_count,
      COUNT(*) FILTER (WHERE status IN ('delivered','read','replied'))        AS delivered_count,
      COUNT(*) FILTER (WHERE status IN ('read','replied'))                    AS read_count,
      COUNT(*) FILTER (WHERE status = 'replied')                              AS replied_count,
      COUNT(*) FILTER (WHERE status IN ('failed', 'retry_pending'))           AS failed_count
    FROM broadcast_recipients
    WHERE broadcast_id = bid
  ) agg
  WHERE b.id = bid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
