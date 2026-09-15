# DayNight Pilot — Authentication Specification

## 1. Authentication Architecture

All protected endpoints enforce server-side authentication validation via `requireAuthentication()`.

Client-provided tokens, cookies, or headers are never trusted blindly. Sessions are validated against server session storage.

## 2. Session Lifecycle & Security Properties

- **Cookie Flags**: `HttpOnly`, `Secure` (in production), `SameSite=Lax`.
- **Session Duration**: 24-hour max lifetime with sliding window refresh.
- **Revocation**: Instant session invalidation on logout or security alert.
- **Log Isolation**: Session IDs and Bearer tokens are automatically redacted from server logs.
