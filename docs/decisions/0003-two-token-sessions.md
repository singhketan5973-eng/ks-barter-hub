---
title: "0003: Use two-token sessions in httpOnly cookies"
type: decision
last_verified: unverified
---

# 0003: Use two-token sessions in httpOnly cookies

Status: Accepted

## Context

The API must know who makes each request. A single long-lived token is risky, because anyone who steals it can act as the user until it expires. A single short-lived token forces people to log in again every few minutes.

## Decision

Use two tokens:

| | Access token | Refresh token |
| --- | --- | --- |
| Format | Signed JWT | Random string |
| Lifetime | 15 minutes | 7 days |
| Stored on the server | No | Yes, as a SHA-256 hash |
| Sent to | Every API request | Only `/api/auth` endpoints |

Store both in `httpOnly` cookies, so page scripts cannot read them. Rotate the refresh token on every use. Group the tokens of one login into a family. If a token that was already used appears again, revoke the whole family.

## Consequences

- A stolen access token works for at most 15 minutes.
- A stolen refresh token is detected the first time both the thief and the real user try to use it.
- Logging out, signing out everywhere, and suspending an account are possible because refresh tokens are stored on the server.
- An access token cannot be revoked before it expires. See the [security notes](../security.md#known-limits).
- The web app must avoid parallel refresh calls. The API helper shares one refresh call between requests and between tabs.
- Cookies require `SameSite=Lax` and a shared parent domain in production.
