// ============================================================
// Account role helpers — pure, unit-testable, no I/O.
//
// Replaces the old hierarchical role system with a permission-based
// RBAC system. The frontend maintains a static map of role permissions
// that matches the `role_permissions` table populated in Supabase.
// ============================================================

export type AccountRole = "owner" | "admin" | "manager" | "team_leader" | "agent" | "viewer";

export const ACCOUNT_ROLES: readonly AccountRole[] = [
  "viewer",
  "agent",
  "team_leader",
  "manager",
  "admin",
  "owner",
] as const;

export function isAccountRole(value: unknown): value is AccountRole {
  return (
    typeof value === "string" &&
    (ACCOUNT_ROLES as readonly string[]).includes(value)
  );
}

// ============================================================
// Granular Permissions
// ============================================================

const ROLE_PERMISSIONS: Record<Exclude<AccountRole, "owner">, string[]> = {
  viewer: [
    "dashboard.view",
    "inbox.view",
    "contacts.view",
    "pipelines.view",
    "broadcasts.view",
    "automations.view",
    "flows.view",
    "reports.view",
  ],
  agent: [
    "dashboard.view",
    "inbox.view",
    "inbox.reply",
    "contacts.view",
    "settings.personal",
  ],
  team_leader: [
    "dashboard.view",
    "inbox.view",
    "inbox.reply",
    "inbox.assign",
    "inbox.close",
    "contacts.view",
    "reports.view",
    "settings.personal",
  ],
  manager: [
    "dashboard.view",
    "inbox.view",
    "inbox.reply",
    "inbox.assign",
    "inbox.close",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "pipelines.view",
    "pipelines.create",
    "pipelines.update",
    "broadcasts.view",
    "automations.view",
    "flows.view",
    "reports.view",
    "reports.export",
    "settings.personal",
  ],
  admin: [
    "dashboard.view",
    "inbox.view",
    "inbox.reply",
    "inbox.assign",
    "inbox.close",
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "contacts.delete",
    "pipelines.view",
    "pipelines.create",
    "pipelines.update",
    "pipelines.delete",
    "broadcasts.view",
    "broadcasts.create",
    "broadcasts.send",
    "automations.view",
    "automations.create",
    "automations.update",
    "automations.delete",
    "flows.view",
    "flows.create",
    "flows.update",
    "flows.delete",
    "reports.view",
    "reports.export",
    "team.manage",
    "settings.personal",
    "whatsapp.manage",
  ],
};

/**
 * Core permission check helper for the frontend.
 * Evaluates whether a role has a specific granular permission.
 * 'owner' bypasses the check and always returns true.
 */
export function hasPermissionFor(role: AccountRole | null, permission: string): boolean {
  if (!role) return false;
  if (role === "owner") return true;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

// ============================================================
// Capability predicates (Legacy wrappers mapped to permissions)
// We keep these so existing UI code doesn't break instantly,
// but they now delegate to hasPermissionFor under the hood.
// ============================================================

export function canManageMembers(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "team.manage");
}

export function canEditSettings(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "whatsapp.manage");
}

export function canSendMessages(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "inbox.reply");
}

export function canViewOnly(role: AccountRole | null): boolean {
  return role === "viewer";
}

export function canDeleteAccount(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "workspace.delete");
}

export function canTransferOwnership(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "workspace.transfer");
}

export function canRunBroadcasts(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "broadcasts.send");
}

export function canBulkImportContacts(role: AccountRole | null): boolean {
  return hasPermissionFor(role, "contacts.create");
}
