"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

interface RequirePermissionProps {
  /** The granular permission required to render `children`. */
  permission: string;
  /** What to render while the permission is lacking OR while we don't
   *  yet know the role (`profileLoading` is true). Defaults to
   *  `null` — most call sites just want the gated element to be
   *  absent until we're sure. Pass a placeholder if a layout slot
   *  would collapse and re-flow when the role resolves. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * `<RequirePermission permission="team.manage">…</RequirePermission>` — conditional render
 * helper for UI gated by account permissions.
 *
 * Three states:
 *   1. profileLoading → render `fallback` (we don't know the role
 *      yet; fail closed so we never flash the gated content to an
 *      under-privileged user).
 *   2. hasPermission  → render `children`.
 *   3. !hasPermission → render `fallback`.
 *
 * Mirrors the server-side `requirePermission(permission)` from `@/lib/auth/account`
 * so client and server gates stay aligned by construction.
 */
export function RequirePermission({
  permission,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const { profileLoading, accountRole, hasPermission } = useAuth();

  if (profileLoading) return <>{fallback}</>;
  if (!accountRole) return <>{fallback}</>;
  if (!hasPermission(permission)) return <>{fallback}</>;

  return <>{children}</>;
}
