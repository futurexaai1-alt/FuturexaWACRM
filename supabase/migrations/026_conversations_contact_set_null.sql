-- ============================================================
-- Allow contact deletion without wiping conversation history.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ── conversations.contact_id ────────────────────────────
ALTER TABLE conversations
  ALTER COLUMN contact_id DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'conversations_contact_id_fkey'
      AND conrelid = 'conversations'::regclass
  ) THEN
    ALTER TABLE conversations
      DROP CONSTRAINT conversations_contact_id_fkey;
  END IF;
END $$;

ALTER TABLE conversations
  ADD CONSTRAINT conversations_contact_id_fkey
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL;
