# DayNight Pilot — Authentication & Session Architecture

## 1. Authentication Philosophy & Entry Points

DayNight Pilot enforces strict server-side authentication. **Client-supplied identifiers (`userId`, `workspaceId`, `role`, `permissions`) are never trusted for authorization decisions.** All security contexts are resolved dynamically from validated session tokens.

### Authentication Entry Points:
1. **Interactive Web UI**: NextAuth.js v5 route handler (`/api/auth/[...nextauth]`) supporting Google OAuth and Argon2 password credentials.
2. **REST API**: Centralized server-side guard `requireAuthentication(request.headers)` inspecting `Authorization: Bearer <token>` or `x-session-token`.
3. **Enterprise SSO**: SAML 2.0 and OIDC identity provider integration (`web/src/lib/security/sso.ts`).
4. **Developer Integrations**: High-entropy API keys (`dnp_live_...`) validated via deterministic SHA-256 hashes (`apiKeyService.ts`).

---

## 2. Server-Side Guard: `requireAuthentication()`

Implemented in `web/src/lib/security/auth.ts`:

```typescript
export async function requireAuthentication(requestHeaders: Headers): Promise<UserSession> {
  const authHeader = requestHeaders.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || requestHeaders.get('x-session-token');

  if (!token) {
    throw new Error('Unauthorized: Missing session token.');
  }

  const session = await validateSessionToken(token);
  if (!session) {
    throw new Error('Unauthorized: Session token is invalid, expired, or revoked.');
  }

  return session;
}
```

The resolved `UserSession` contains:
- `userId`: Verified database UUID.
- `workspaceId`: Primary active tenant workspace ID.
- `organizationId`: Parent organization UUID.
- `role`: Membership role evaluated against the organization.
- `expiresAt`: Absolute expiration timestamp.
- `isRevoked`: Boolean revocation flag.

---

## 3. Session Lifecycle & Cookie Configuration

| Parameter | Configuration | Security Purpose |
| :--- | :--- | :--- |
| **Storage** | Server-side active session store / database | Eliminates stateless token replay after revocation. |
| **Lifetime** | 24 hours (`maxAge: 86400`) | Enforces finite session exposure. |
| **HttpOnly** | `true` | Prevents token theft via cross-site scripting (XSS). |
| **Secure** | `true` in production (`process.env.NODE_ENV === 'production'`) | Transmitted exclusively over TLS 1.3. |
| **SameSite** | `Lax` | Protects against Cross-Site Request Forgery (CSRF). |
| **Path** | `/` | Scoped to entire application origin. |

---

## 4. Session Revocation & Invalidation

When a user logs out or when suspicious activity is detected:
1. `revokeSession(token)` sets `session.isRevoked = true`.
2. The session is immediately rejected on subsequent requests, even if `expiresAt` is in the future.
3. In production, `registerTestSession()` is permanently blocked to prevent unauthorized test session injection in live deployments.

---

## 5. Required Regression Tests

Verified in `tests/security/sessions/session-lifecycle.test.ts`:
- Anonymous request -> protected endpoint -> 401 Unauthorized
- Expired session token -> protected endpoint -> 401 Unauthorized
- Revoked session token -> protected endpoint -> 401 Unauthorized
- Valid session token -> protected endpoint -> Success (returns active session)
- Session cookie attributes conform to security requirements (`httpOnly: true`, `sameSite: 'lax'`)
