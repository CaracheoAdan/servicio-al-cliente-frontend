/**
 * Decodes a JWT token payload without signature verification.
 * Only used for client-side expiry checks — the backend must always verify signatures.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Handle URL-safe base64 encoding
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = atob(base64);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired by reading the `exp` claim.
 * Returns `true` if the token is malformed.
 * Returns `false` if the token has no `exp` claim (server-managed expiry).
 * Adds a 30-second buffer to handle clock skew.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true; // Malformed token → treat as expired
  if (typeof payload.exp !== 'number') return false; // No exp claim → server manages
  const BUFFER_MS = 30_000;
  return Date.now() >= payload.exp * 1000 - BUFFER_MS;
}
