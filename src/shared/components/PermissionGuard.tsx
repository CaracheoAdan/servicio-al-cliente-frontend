import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  /** Required permission key (e.g. 'orders', 'users', 'catalogs') */
  permission?: string;
  /** Route to redirect unauthorized users to. Defaults to '/orders' */
  redirectTo?: string;
}

/**
 * Route-level guard that enforces authentication and permission checks.
 *
 * - Redirects to `/login` if the user is not authenticated.
 * - Admins always pass permission checks.
 * - Non-admin users must have the specified `permission` in their role.
 *
 * Usage:
 * ```tsx
 * <PermissionGuard permission="users">
 *   <UsersPage />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  children,
  permission,
  redirectTo = '/orders',
}: PermissionGuardProps) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
