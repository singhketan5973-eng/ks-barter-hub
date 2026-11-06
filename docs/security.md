---
title: Security
type: concept
last_verified: unverified
---

# Security

This document explains how Barter Hub protects accounts and data, and lists the known limits. Barter Hub is a public site, so these protections are part of the design and not an afterthought.

## Protections in place

| Risk | Protection | Where |
| --- | --- | --- |
| Stolen password database | Passwords are hashed with bcrypt (cost 12). Each hash includes a random salt. The password itself is never stored or logged. | `utils/password.js` |
| Weak passwords | At least 8 characters, at most 72 bytes, with a letter and a number. The 72-byte limit exists because bcrypt ignores anything longer. | `validators/auth.validators.js` |
| Guessing passwords | Login and registration allow 10 attempts per 15 minutes per IP address in production (100 in development). | `middleware/rateLimiters.js` |
| Discovering which emails have accounts through login | An unknown email and a wrong password return the same message. A dummy hash check keeps the response time similar. | `services/auth.service.js` |
| Script injection stealing tokens | Both tokens are in `httpOnly` cookies, which page scripts cannot read. | `utils/cookies.js` |
| Cross-site request forgery | Cookies use `SameSite=Lax`, so browsers do not send them on cross-site `POST` requests. | `utils/cookies.js` |
| Cookies sent over plain HTTP | Cookies are marked `Secure` in production. | `utils/cookies.js` |
| A stolen access token | Access tokens expire after 15 minutes. | `utils/tokens.js` |
| A stolen refresh token | Refresh tokens are single-use and rotate on every refresh. Reusing an old token revokes the whole session family. | `services/auth.service.js` |
| A leaked token database | Refresh tokens are stored only as SHA-256 hashes. | `utils/refreshToken.js` |
| Forged tokens | Access tokens are signed with HS256, the algorithm is fixed during verification, and the issuer is checked. | `utils/tokens.js` |
| Malformed or malicious input | Every request is validated with Zod. Unknown fields are dropped, so a request cannot set `role`. | `middleware/validate.js` |
| Self-promotion to admin | Roles cannot be set through any endpoint. An admin role is set directly in the database. | `models/User.js` |
| Stale permissions | The `authorize` middleware reads the role and status from the database on every admin request, not from the token. | `middleware/auth.js` |
| Abusive accounts | Admins can suspend an account. Suspension blocks login and revokes every refresh token of the user. | `services/admin.service.js` |
| Browser attacks on responses | The `helmet` middleware adds security headers. | `app.js` |
| Other websites calling the API | CORS allows only the address in `CLIENT_URL`. | `app.js` |
| Oversized requests | JSON bodies are limited to 1 MB. | `app.js` |
| Open redirects after login | The `next` parameter accepts only paths on the same site. | `client/src/lib/redirect.js` |
| Leaked secrets | `.env` files are ignored by Git, settings are validated at startup, and `.env.example` holds placeholders only. | `.gitignore`, `config/env.js` |
| Information leaks in errors | Unexpected errors return a generic message. Stack traces appear only when `NODE_ENV` is `development`. | `middleware/errorHandler.js` |

## Known limits

These are gaps that exist today. Each one is planned work or an accepted trade-off.

| Limit | Detail | Plan |
| --- | --- | --- |
| Access tokens cannot be revoked one by one | After logout or suspension, an access token stays valid until it expires, for up to 15 minutes, on routes that only check the token. The `/auth/me` endpoint and admin routes check the database and reject suspended accounts immediately. | Accepted trade-off of short-lived tokens. Sensitive actions will check the account status. |
| Registration reveals registered emails | The error `An account with this email already exists` tells a visitor that an email is registered. | Mitigated by rate limits. |
| No breached-password check | A password such as `Password123` passes the rules even though attackers know it. | Planned: check passwords against a breach list before accepting them. |
| No email verification or password reset | The `isEmailVerified` field stays `false`, and a forgotten password cannot be recovered. | Planned before launch. |
| Same-site deployment required | `SameSite=Lax` cookies work only when the web app and the API share a parent domain, for example `app.example.com` and `api.example.com`. | Plan the domains before deployment. |
| Logout needs the network | If the logout request does not reach the API, the screen shows a logged-out state, but the refresh token stays valid until it expires. | Use **Sign out everywhere** to end all sessions. |
| No automated tests | Security behavior has been checked by hand. | Planned: automated API tests and a dependency audit in the pipeline. |
| Development-only dependency warnings | `npm audit` reports issues in the linting tools of the web app. They run only on a developer machine. | Re-check before deployment. |

## Reporting a problem

If you find a security problem, do not open a public issue. Contact the project owner directly.
