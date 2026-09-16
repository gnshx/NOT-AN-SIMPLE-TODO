---
name: oauth-auth-flows
description: "Secure OAuth 2.0 & OIDC implementation: PKCE authorization code flows, refresh token rotation, secure cookie flags, and Auth.js/NextAuth patterns."
category: security
risk: safe
tags: [oauth, auth, oidc, security, nextauth]
---

# Modern OAuth 2.0 & Authentication Standards

Engineering standards for secure third-party login (Google, GitHub, Microsoft) and token lifecycle management.

## 1. PKCE (Proof Key for Code Exchange)

Always enforce Authorization Code Flow with PKCE (`code_verifier` + `code_challenge` SHA-256) for both single-page apps and server-rendered apps to prevent authorization code interception.

## 2. Refresh Token Rotation & Envelope Encryption

- Never store refresh tokens in plaintext. Encrypt at rest using AES-256-GCM.
- On every token refresh call:
  1. Issue a new access token **and** a brand-new single-use refresh token.
  2. Invalidate the old refresh token.
  3. If an already-invalidated refresh token is presented, immediately revoke all tokens in the user's family (detects stolen tokens).

## 3. Secure Session Cookies

Every authentication cookie must specify:
- `HttpOnly`: Prevents access from client-side JavaScript (mitigates XSS cookie theft).
- `Secure`: Ensures cookies are only transmitted over TLS/HTTPS.
- `SameSite=Lax` (or `Strict`): Defends against Cross-Site Request Forgery (CSRF).
- Explicit `Path=/` and scoped `Domain`.
