import { describe, expect, it } from "vitest";
import {
  ACCOUNT_ROLES,
  canDeleteAccount,
  canEditSettings,
  canManageMembers,
  canSendMessages,
  canTransferOwnership,
  canViewOnly,
  hasPermissionFor,
  isAccountRole,
} from "./roles";

describe("hasPermissionFor", () => {
  it("returns true for owner on any permission", () => {
    expect(hasPermissionFor("owner", "any.permission")).toBe(true);
    expect(hasPermissionFor("owner", "random.thing")).toBe(true);
  });

  it("checks specific permissions for viewer", () => {
    expect(hasPermissionFor("viewer", "dashboard.view")).toBe(true);
    expect(hasPermissionFor("viewer", "inbox.reply")).toBe(false);
  });

  it("checks specific permissions for admin", () => {
    expect(hasPermissionFor("admin", "team.manage")).toBe(true);
    expect(hasPermissionFor("admin", "contacts.delete")).toBe(true);
  });
});

describe("isAccountRole", () => {
  it("accepts every value in ACCOUNT_ROLES", () => {
    for (const role of ACCOUNT_ROLES) {
      expect(isAccountRole(role)).toBe(true);
    }
  });

  it("rejects garbage / case mismatch / non-strings", () => {
    expect(isAccountRole("Owner")).toBe(false);
    expect(isAccountRole("")).toBe(false);
    expect(isAccountRole(null)).toBe(false);
    expect(isAccountRole(undefined)).toBe(false);
    expect(isAccountRole(123)).toBe(false);
    expect(isAccountRole("superuser")).toBe(false);
  });
});

describe("capability predicates", () => {
  it("canManageMembers: admin+ only", () => {
    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("admin")).toBe(true);
    expect(canManageMembers("agent")).toBe(false);
    expect(canManageMembers("viewer")).toBe(false);
  });

  it("canEditSettings: admin+ only", () => {
    expect(canEditSettings("owner")).toBe(true);
    expect(canEditSettings("admin")).toBe(true);
    expect(canEditSettings("agent")).toBe(false);
    expect(canEditSettings("viewer")).toBe(false);
  });

  it("canSendMessages: agent+ only", () => {
    expect(canSendMessages("owner")).toBe(true);
    expect(canSendMessages("admin")).toBe(true);
    expect(canSendMessages("manager")).toBe(true);
    expect(canSendMessages("team_leader")).toBe(true);
    expect(canSendMessages("agent")).toBe(true);
    expect(canSendMessages("viewer")).toBe(false);
  });

  it("canViewOnly", () => {
    expect(canViewOnly("owner")).toBe(false);
    expect(canViewOnly("admin")).toBe(false);
    expect(canViewOnly("agent")).toBe(false);
    expect(canViewOnly("viewer")).toBe(true);
  });

  it("canDeleteAccount: owner only", () => {
    expect(canDeleteAccount("owner")).toBe(true);
    expect(canDeleteAccount("admin")).toBe(false);
    expect(canDeleteAccount("agent")).toBe(false);
    expect(canDeleteAccount("viewer")).toBe(false);
  });

  it("canTransferOwnership: owner only", () => {
    expect(canTransferOwnership("owner")).toBe(true);
    expect(canTransferOwnership("admin")).toBe(false);
    expect(canTransferOwnership("agent")).toBe(false);
    expect(canTransferOwnership("viewer")).toBe(false);
  });
});
