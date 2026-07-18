-- ============================================================
-- Add contact_phone to conversations so history survives contact deletion.
-- ============================================================

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Backfill from contacts
UPDATE conversations c
SET contact_phone = t.phone
FROM contacts t
WHERE c.contact_id = t.id AND c.contact_phone IS NULL;
