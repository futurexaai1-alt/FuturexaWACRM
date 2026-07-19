-- ==== Update Broadcasts RLS to require 'admin' role instead of 'agent' ====

-- Update policies on broadcasts
DROP POLICY IF EXISTS broadcasts_insert ON broadcasts;
CREATE POLICY broadcasts_insert ON broadcasts FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS broadcasts_update ON broadcasts;
CREATE POLICY broadcasts_update ON broadcasts FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS broadcasts_delete ON broadcasts;
CREATE POLICY broadcasts_delete ON broadcasts FOR DELETE USING (is_account_member(account_id, 'admin'));

-- Update policies on broadcast_recipients
DROP POLICY IF EXISTS broadcast_recipients_insert ON broadcast_recipients;
CREATE POLICY broadcast_recipients_insert ON broadcast_recipients FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id, 'admin'))
);

DROP POLICY IF EXISTS broadcast_recipients_update ON broadcast_recipients;
CREATE POLICY broadcast_recipients_update ON broadcast_recipients FOR UPDATE USING (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id, 'admin'))
);

DROP POLICY IF EXISTS broadcast_recipients_delete ON broadcast_recipients;
CREATE POLICY broadcast_recipients_delete ON broadcast_recipients FOR DELETE USING (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id, 'admin'))
);
