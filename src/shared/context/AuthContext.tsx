import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

// ─── Storage Keys ────────────────────────────────────────────────
export const AUTH_STORAGE_KEYS = {
  USER: 'totebin_user',
  USER_NAME: 'totebin_user_name',
} as const;

/** Custom event dispatched by the axios interceptor when a 401 is received */
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

// ─── Types ───────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: Record<string, unknown>) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────
function parsePermissions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((p): p is string => typeof p === 'string');
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((p): p is string => typeof p === 'string');
    } catch { /* ignore malformed JSON */ }
  }
  return [];
}

function parseStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!stored) return null;
    const data = JSON.parse(stored);
    return {
      id: data.id,
      email: data.email || '',
      firstName: data.firstName || data.first_name || '',
      lastName: data.lastName || data.last_name || '',
      role: data.role || '',
      permissions: parsePermissions(data.permissions),
    };
  } catch {
    return null;
  }
}

function clearAuthStorage(): void {
  Object.values(AUTH_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

// ─── Context ─────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return parseStoredUser();
  });

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback((userData: Record<string, unknown>) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userData));

    setUser({
      id: userData.id as number,
      email: (userData.email as string) || '',
      firstName: (userData.firstName as string) || (userData.first_name as string) || '',
      lastName: (userData.lastName as string) || (userData.last_name as string) || '',
      role: (userData.role as string) || '',
      permissions: parsePermissions(userData.permissions),
    });
  }, []);

  // ── Listen for 401 session-expired events from axios interceptor ──
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
  }, [logout]);

  // ── Derived state ─────────────────────────────────────────
  const isAdmin = useMemo(() => {
    return !!user?.role && user.role.toLowerCase().includes('admin');
  }, [user?.role]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (isAdmin) return true;
      return user?.permissions?.includes(permission) ?? false;
    },
    [isAdmin, user?.permissions],
  );

  const isAuthenticated = !!user;

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated, isAdmin, login, logout, hasPermission }),
    [user, isAuthenticated, isAdmin, login, logout, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
