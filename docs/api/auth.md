---
title: Authentication endpoints
type: reference
last_verified: unverified
---

# Authentication endpoints

These endpoints create accounts and manage login sessions. For the rules that apply to all endpoints, see the [API overview](overview.md).

## The user object

Endpoints that return `user` use this shape. The owner of the account sees all fields.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | The user's id |
| `name` | string | Display name |
| `email` | string | Email address, in lowercase |
| `role` | string | `user` or `admin` |
| `status` | string | `active` or `suspended` |
| `bio` | string | Short description. Empty by default. |
| `city` | string | Town or city. Empty by default. |
| `isEmailVerified` | boolean | Always `false` until email verification is built |
| `createdAt` | string | When the account was created |
| `updatedAt` | string | When the account last changed |
| `lastLoginAt` | string | When the user last logged in. Absent before the first login. |

The password hash is never returned.

## POST /auth/register

Creates an account. It does not log the user in.

**Authentication:** None. **Rate limit:** Login and registration limit.

Request body:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | string | Yes | 2 to 80 characters, trimmed |
| `email` | string | Yes | A valid email address. Trimmed and converted to lowercase. |
| `password` | string | Yes | 8 or more characters, at most 72 bytes, with at least one letter and one number |

```json
{
  "name": "Asha Rao",
  "email": "asha@example.com",
  "password": "Maple2026"
}
```

Response `201`:

```json
{
  "user": {
    "id": "6ac7396c4fc546a12d7fb701",
    "name": "Asha Rao",
    "email": "asha@example.com",
    "role": "user",
    "status": "active",
    "bio": "",
    "city": "",
    "isEmailVerified": false,
    "createdAt": "2026-11-06T10:00:00.000Z",
    "updatedAt": "2026-11-06T10:00:00.000Z"
  }
}
```

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `400` | `Validation failed` | A field breaks a rule. `details` lists every field with a problem. |
| `409` | `An account with this email already exists` | The email is registered |
| `429` | `Too many attempts, please try again later` | The rate limit was reached |

## POST /auth/login

Checks the email and password, and starts a session.

**Authentication:** None. **Rate limit:** Login and registration limit.

Request body:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `email` | string | Yes | A valid email address |
| `password` | string | Yes | Any non-empty string |

```json
{
  "email": "asha@example.com",
  "password": "Maple2026"
}
```

Response `200`: the `user` object, as in the registration response, with `lastLoginAt` set. The response also sets the `accessToken` and `refreshToken` cookies. The tokens are never in the JSON body.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `400` | `Validation failed` | The email is malformed or the password is empty |
| `401` | `Invalid email or password` | The email is unknown or the password is wrong. The two cases are not distinguishable. |
| `403` | `This account is not active` | The password is correct, but the account is suspended |
| `429` | `Too many attempts, please try again later` | The rate limit was reached |

## POST /auth/refresh

Exchanges the refresh token for a new access token and a new refresh token. The old refresh token stops working immediately.

**Authentication:** The `refreshToken` cookie. **Rate limit:** Refresh limit. **Request body:** None.

Response `200`: the `user` object, plus new `accessToken` and `refreshToken` cookies.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `401` | `Authentication required` | The `refreshToken` cookie is missing |
| `401` | `Invalid or expired session` | The token is unknown or expired, or the account is not active |
| `401` | `Session no longer valid, please log in again` | The token was already used. The whole session is revoked. |
| `429` | `Too many requests, please try again later` | The rate limit was reached |

Every `401` response from this endpoint also clears both cookies. Use each refresh token only once. Two refresh requests that carry the same token at the same time count as reuse, and the session ends.

## POST /auth/logout

Ends the current session. It succeeds even when there is no session.

**Authentication:** None. **Request body:** None.

Response `204`, with no body. The response clears both cookies and revokes the session that the `refreshToken` cookie belongs to.

## POST /auth/logout-all

Ends every session of the current user, on all devices.

**Authentication:** The `accessToken` cookie. **Request body:** None.

Response `204`, with no body. The response clears both cookies and revokes every refresh token of the user.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `401` | `Authentication required` | The `accessToken` cookie is missing |
| `401` | `Invalid or expired token` | The access token is invalid or expired |

An access token that was already issued stays valid until it expires, for up to 15 minutes. See the [security notes](../security.md#known-limits).

## GET /auth/me

Returns the current user.

**Authentication:** The `accessToken` cookie. **Request body:** None.

Response `200`: `{ "user": { ... } }`, with the full user object.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `401` | `Authentication required` | The `accessToken` cookie is missing, or the account no longer exists or is suspended |
| `401` | `Invalid or expired token` | The access token is invalid or expired |
