-- ============================================================
-- 031_rbac_permissions.sql â€” Granular Role-Based Access Control
--
-- This migration transforms the fixed role-hierarchy system into a
-- robust, permission-based RBAC system. Roles become collections of
-- granular permissions (e.g. `contacts.edit`). 
-- ============================================================

-- 1. Extend the enum for new roles
DO $$
BEGIN
  ALTER TYPE account_role_enum ADD VALUE 'team_leader';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TYPE account_role_enum ADD VALUE 'manager';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- 2. Create the permissions schema
CREATE TABLE IF NOT EXISTS permissions (
  name TEXT PRIMARY KEY,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role account_role_enum NOT NULL,
  permission TEXT NOT NULL REFERENCES permissions(name) ON DELETE CASCADE,
  PRIMARY KEY (role, permission)
);

-- Seed all the granular permissions
INSERT INTO permissions (name, description) VALUES
  ('dashboard.view', 'View dashboard overview'),
  ('inbox.view', 'View conversations'),
  ('inbox.reply', 'Reply to conversations'),
  ('inbox.assign', 'Assign conversations to teammates'),
  ('inbox.close', 'Close conversations'),
  ('contacts.view', 'View contacts'),
  ('contacts.create', 'Create new contacts'),
  ('contacts.edit', 'Edit contacts'),
  ('contacts.delete', 'Delete contacts'),
  ('pipelines.view', 'View pipelines and deals'),
  ('pipelines.create', 'Create pipelines and deals'),
  ('pipelines.update', 'Update pipelines and deals'),
  ('pipelines.delete', 'Delete pipelines and deals'),
  ('broadcasts.view', 'View broadcasts history'),
  ('broadcasts.create', 'Create broadcasts'),
  ('broadcasts.send', 'Send broadcasts'),
  ('automations.view', 'View automations'),
  ('automations.edit', 'Edit automations'),
  ('automations.create', 'Create automations'),
  ('automations.delete', 'Delete automations'),
  ('flows.view', 'View flows'),
  ('flows.edit', 'Edit flows'),
  ('flows.create', 'Create flows'),
  ('flows.delete', 'Delete flows'),
  ('reports.view', 'View reports'),
  ('reports.export', 'Export reports'),
  ('team.manage', 'Manage team members (invite, change roles)'),
  ('settings.personal', 'Manage personal settings'),
  ('billing.manage', 'Manage account billing'),
  ('api.manage', 'Manage API keys and developer settings'),
  ('workspace.delete', 'Delete the entire workspace'),
  ('workspace.transfer', 'Transfer workspace ownership'),
  ('whatsapp.manage', 'Manage WhatsApp Cloud API config')
ON CONFLICT (name) DO NOTHING;

-- Seed the exact permissions mapped to the spec
-- We clear existing mappings first for idempotency
DELETE FROM role_permissions;

-- Viewer (View Only)
INSERT INTO role_permissions (role, permission) VALUES
  ('viewer', 'dashboard.view'),
  ('viewer', 'inbox.view'),
  ('viewer', 'contacts.view'),
  ('viewer', 'pipelines.view'),
  ('viewer', 'broadcasts.view'),
  ('viewer', 'automations.view'),
  ('viewer', 'flows.view'),
  ('viewer', 'reports.view');

-- Agent (Support agent base)
INSERT INTO role_permissions (role, permission) VALUES
  ('agent', 'dashboard.view'),
  ('agent', 'inbox.view'),
  ('agent', 'inbox.reply'),
  ('agent', 'contacts.view'),
  ('agent', 'settings.personal');

-- Team Leader
INSERT INTO role_permissions (role, permission) VALUES
  ('team_leader', 'dashboard.view'),
  ('team_leader', 'inbox.view'),
  ('team_leader', 'inbox.reply'),
  ('team_leader', 'inbox.assign'),
  ('team_leader', 'inbox.close'),
  ('team_leader', 'contacts.view'),
  ('team_leader', 'reports.view'),
  ('team_leader', 'settings.personal');

-- Manager
INSERT INTO role_permissions (role, permission) VALUES
  ('manager', 'dashboard.view'),
  ('manager', 'inbox.view'),
  ('manager', 'inbox.reply'),
  ('manager', 'inbox.assign'),
  ('manager', 'inbox.close'),
  ('manager', 'contacts.view'),
  ('manager', 'contacts.create'),
  ('manager', 'contacts.edit'),
  ('manager', 'pipelines.view'),
  ('manager', 'pipelines.create'),
  ('manager', 'pipelines.update'),
  ('manager', 'broadcasts.view'),
  ('manager', 'automations.view'),
  ('manager', 'flows.view'),
  ('manager', 'reports.view'),
  ('manager', 'reports.export'),
  ('manager', 'settings.personal');

-- Admin
INSERT INTO role_permissions (role, permission) VALUES
  ('admin', 'dashboard.view'),
  ('admin', 'inbox.view'),
  ('admin', 'inbox.reply'),
  ('admin', 'inbox.assign'),
  ('admin', 'inbox.close'),
  ('admin', 'contacts.view'),
  ('admin', 'contacts.create'),
  ('admin', 'contacts.edit'),
  ('admin', 'contacts.delete'),
  ('admin', 'pipelines.view'),
  ('admin', 'pipelines.create'),
  ('admin', 'pipelines.update'),
  ('admin', 'pipelines.delete'),
  ('admin', 'broadcasts.view'),
  ('admin', 'broadcasts.create'),
  ('admin', 'broadcasts.send'),
  ('admin', 'automations.view'),
  ('admin', 'flows.view'),
  ('admin', 'reports.view'),
  ('admin', 'reports.export'),
  ('admin', 'team.manage'),
  ('admin', 'settings.personal'),
  ('admin', 'whatsapp.manage');

-- NOTE: Global Admin (`owner`) is given blanket access dynamically in 
-- the helper function `has_permission`, so we don't map individual rows here.


-- 3. Replace the `is_account_member` helper with the new `has_permission` helper
CREATE OR REPLACE FUNCTION has_permission(
  target_account_id UUID,
  required_permission TEXT
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    -- We LEFT JOIN so `owner` still evaluates even if no rows exist in `role_permissions`
    LEFT JOIN role_permissions rp ON rp.role = p.account_role AND rp.permission = required_permission
    WHERE p.user_id = auth.uid()
      AND p.account_id = target_account_id
      AND (p.account_role = 'owner' OR rp.permission = required_permission)
  );
$$;

-- Grant execution permissions
ALTER FUNCTION has_permission(UUID, TEXT) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT) TO authenticated, service_role;

-- 4. Rewrite ALL RLS Policies to use `has_permission` instead of `is_account_member`

-- ================= contacts =================
DROP POLICY IF EXISTS contacts_select ON contacts;
DROP POLICY IF EXISTS contacts_insert ON contacts;
DROP POLICY IF EXISTS contacts_update ON contacts;
DROP POLICY IF EXISTS contacts_delete ON contacts;

CREATE POLICY contacts_select ON contacts FOR SELECT USING (has_permission(account_id, 'contacts.view'));
CREATE POLICY contacts_insert ON contacts FOR INSERT WITH CHECK (has_permission(account_id, 'contacts.create'));
CREATE POLICY contacts_update ON contacts FOR UPDATE USING (has_permission(account_id, 'contacts.edit'));
CREATE POLICY contacts_delete ON contacts FOR DELETE USING (has_permission(account_id, 'contacts.delete'));

-- ================= tags =================
DROP POLICY IF EXISTS tags_select ON tags;
DROP POLICY IF EXISTS tags_insert ON tags;
DROP POLICY IF EXISTS tags_update ON tags;
DROP POLICY IF EXISTS tags_delete ON tags;

CREATE POLICY tags_select ON tags FOR SELECT USING (has_permission(account_id, 'contacts.view'));
CREATE POLICY tags_insert ON tags FOR INSERT WITH CHECK (has_permission(account_id, 'contacts.edit'));
CREATE POLICY tags_update ON tags FOR UPDATE USING (has_permission(account_id, 'contacts.edit'));
CREATE POLICY tags_delete ON tags FOR DELETE USING (has_permission(account_id, 'contacts.edit'));

-- ================= custom_fields =================
DROP POLICY IF EXISTS custom_fields_select ON custom_fields;
DROP POLICY IF EXISTS custom_fields_insert ON custom_fields;
DROP POLICY IF EXISTS custom_fields_update ON custom_fields;
DROP POLICY IF EXISTS custom_fields_delete ON custom_fields;

CREATE POLICY custom_fields_select ON custom_fields FOR SELECT USING (has_permission(account_id, 'contacts.view'));
CREATE POLICY custom_fields_insert ON custom_fields FOR INSERT WITH CHECK (has_permission(account_id, 'contacts.edit'));
CREATE POLICY custom_fields_update ON custom_fields FOR UPDATE USING (has_permission(account_id, 'contacts.edit'));
CREATE POLICY custom_fields_delete ON custom_fields FOR DELETE USING (has_permission(account_id, 'contacts.edit'));

-- ================= contact_notes =================
DROP POLICY IF EXISTS contact_notes_select ON contact_notes;
DROP POLICY IF EXISTS contact_notes_insert ON contact_notes;
DROP POLICY IF EXISTS contact_notes_update ON contact_notes;
DROP POLICY IF EXISTS contact_notes_delete ON contact_notes;

CREATE POLICY contact_notes_select ON contact_notes FOR SELECT USING (has_permission(account_id, 'contacts.view'));
CREATE POLICY contact_notes_insert ON contact_notes FOR INSERT WITH CHECK (has_permission(account_id, 'contacts.edit'));
CREATE POLICY contact_notes_update ON contact_notes FOR UPDATE USING (has_permission(account_id, 'contacts.edit'));
CREATE POLICY contact_notes_delete ON contact_notes FOR DELETE USING (has_permission(account_id, 'contacts.delete'));

-- ================= conversations =================
DROP POLICY IF EXISTS conversations_select ON conversations;
DROP POLICY IF EXISTS conversations_insert ON conversations;
DROP POLICY IF EXISTS conversations_update ON conversations;
DROP POLICY IF EXISTS conversations_delete ON conversations;

CREATE POLICY conversations_select ON conversations FOR SELECT USING (has_permission(account_id, 'inbox.view'));
CREATE POLICY conversations_insert ON conversations FOR INSERT WITH CHECK (has_permission(account_id, 'inbox.reply'));
CREATE POLICY conversations_update ON conversations FOR UPDATE USING (has_permission(account_id, 'inbox.reply') OR has_permission(account_id, 'inbox.assign') OR has_permission(account_id, 'inbox.close'));
CREATE POLICY conversations_delete ON conversations FOR DELETE USING (has_permission(account_id, 'inbox.close'));

-- ================= whatsapp_config =================
DROP POLICY IF EXISTS whatsapp_config_select ON whatsapp_config;
DROP POLICY IF EXISTS whatsapp_config_insert ON whatsapp_config;
DROP POLICY IF EXISTS whatsapp_config_update ON whatsapp_config;
DROP POLICY IF EXISTS whatsapp_config_delete ON whatsapp_config;

CREATE POLICY whatsapp_config_select ON whatsapp_config FOR SELECT USING (has_permission(account_id, 'whatsapp.manage'));
CREATE POLICY whatsapp_config_insert ON whatsapp_config FOR INSERT WITH CHECK (has_permission(account_id, 'whatsapp.manage'));
CREATE POLICY whatsapp_config_update ON whatsapp_config FOR UPDATE USING (has_permission(account_id, 'whatsapp.manage'));
CREATE POLICY whatsapp_config_delete ON whatsapp_config FOR DELETE USING (has_permission(account_id, 'whatsapp.manage'));

-- ================= message_templates =================
DROP POLICY IF EXISTS message_templates_select ON message_templates;
DROP POLICY IF EXISTS message_templates_insert ON message_templates;
DROP POLICY IF EXISTS message_templates_update ON message_templates;
DROP POLICY IF EXISTS message_templates_delete ON message_templates;

CREATE POLICY message_templates_select ON message_templates FOR SELECT USING (has_permission(account_id, 'whatsapp.manage') OR has_permission(account_id, 'broadcasts.create'));
CREATE POLICY message_templates_insert ON message_templates FOR INSERT WITH CHECK (has_permission(account_id, 'whatsapp.manage'));
CREATE POLICY message_templates_update ON message_templates FOR UPDATE USING (has_permission(account_id, 'whatsapp.manage'));
CREATE POLICY message_templates_delete ON message_templates FOR DELETE USING (has_permission(account_id, 'whatsapp.manage'));

-- ================= pipelines =================
DROP POLICY IF EXISTS pipelines_select ON pipelines;
DROP POLICY IF EXISTS pipelines_insert ON pipelines;
DROP POLICY IF EXISTS pipelines_update ON pipelines;
DROP POLICY IF EXISTS pipelines_delete ON pipelines;

CREATE POLICY pipelines_select ON pipelines FOR SELECT USING (has_permission(account_id, 'pipelines.view'));
CREATE POLICY pipelines_insert ON pipelines FOR INSERT WITH CHECK (has_permission(account_id, 'pipelines.create'));
CREATE POLICY pipelines_update ON pipelines FOR UPDATE USING (has_permission(account_id, 'pipelines.update'));
CREATE POLICY pipelines_delete ON pipelines FOR DELETE USING (has_permission(account_id, 'pipelines.delete'));

-- ================= deals =================
DROP POLICY IF EXISTS deals_select ON deals;
DROP POLICY IF EXISTS deals_insert ON deals;
DROP POLICY IF EXISTS deals_update ON deals;
DROP POLICY IF EXISTS deals_delete ON deals;

CREATE POLICY deals_select ON deals FOR SELECT USING (has_permission(account_id, 'pipelines.view'));
CREATE POLICY deals_insert ON deals FOR INSERT WITH CHECK (has_permission(account_id, 'pipelines.create'));
CREATE POLICY deals_update ON deals FOR UPDATE USING (has_permission(account_id, 'pipelines.update'));
CREATE POLICY deals_delete ON deals FOR DELETE USING (has_permission(account_id, 'pipelines.delete'));

-- ================= broadcasts =================
DROP POLICY IF EXISTS broadcasts_select ON broadcasts;
DROP POLICY IF EXISTS broadcasts_insert ON broadcasts;
DROP POLICY IF EXISTS broadcasts_update ON broadcasts;
DROP POLICY IF EXISTS broadcasts_delete ON broadcasts;

CREATE POLICY broadcasts_select ON broadcasts FOR SELECT USING (has_permission(account_id, 'broadcasts.view'));
CREATE POLICY broadcasts_insert ON broadcasts FOR INSERT WITH CHECK (has_permission(account_id, 'broadcasts.create'));
CREATE POLICY broadcasts_update ON broadcasts FOR UPDATE USING (has_permission(account_id, 'broadcasts.create'));
CREATE POLICY broadcasts_delete ON broadcasts FOR DELETE USING (has_permission(account_id, 'broadcasts.create'));

-- ================= automations =================
DROP POLICY IF EXISTS automations_select ON automations;
DROP POLICY IF EXISTS automations_insert ON automations;
DROP POLICY IF EXISTS automations_update ON automations;
DROP POLICY IF EXISTS automations_delete ON automations;

CREATE POLICY automations_select ON automations FOR SELECT USING (has_permission(account_id, 'automations.view'));
CREATE POLICY automations_insert ON automations FOR INSERT WITH CHECK (has_permission(account_id, 'automations.create'));
CREATE POLICY automations_update ON automations FOR UPDATE USING (has_permission(account_id, 'automations.edit'));
CREATE POLICY automations_delete ON automations FOR DELETE USING (has_permission(account_id, 'automations.delete'));

-- ================= flows =================
DROP POLICY IF EXISTS flows_select ON flows;
DROP POLICY IF EXISTS flows_insert ON flows;
DROP POLICY IF EXISTS flows_update ON flows;
DROP POLICY IF EXISTS flows_delete ON flows;

CREATE POLICY flows_select ON flows FOR SELECT USING (has_permission(account_id, 'flows.view'));
CREATE POLICY flows_insert ON flows FOR INSERT WITH CHECK (has_permission(account_id, 'flows.create'));
CREATE POLICY flows_update ON flows FOR UPDATE USING (has_permission(account_id, 'flows.edit'));
CREATE POLICY flows_delete ON flows FOR DELETE USING (has_permission(account_id, 'flows.delete'));

-- ================= flow_runs =================
DROP POLICY IF EXISTS flow_runs_select ON flow_runs;
DROP POLICY IF EXISTS flow_runs_insert ON flow_runs;
DROP POLICY IF EXISTS flow_runs_update ON flow_runs;
DROP POLICY IF EXISTS flow_runs_delete ON flow_runs;

CREATE POLICY flow_runs_select ON flow_runs FOR SELECT USING (has_permission(account_id, 'flows.view'));
CREATE POLICY flow_runs_insert ON flow_runs FOR INSERT WITH CHECK (has_permission(account_id, 'flows.edit'));
CREATE POLICY flow_runs_update ON flow_runs FOR UPDATE USING (has_permission(account_id, 'flows.edit'));
CREATE POLICY flow_runs_delete ON flow_runs FOR DELETE USING (has_permission(account_id, 'flows.edit'));
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY role_permissions_select ON role_permissions FOR SELECT USING (true);
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY permissions_select ON permissions FOR SELECT USING (true);
