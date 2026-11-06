---
title: User endpoints
type: reference
last_verified: unverified
---

# User endpoints

These endpoints show and edit profiles, and let admins manage accounts. For the rules that apply to all endpoints, see the [API overview](overview.md). The full `user` object is described in [Authentication endpoints](auth.md#the-user-object).

## GET /users/:id

Returns the public profile of a user. The profile never includes the email address.

**Authentication:** None.

Path parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | string | The user's id, 24 hexadecimal characters |

Response `200`:

```json
{
  "user": {
    "id": "6ac7396c4fc546a12d7fb701",
    "name": "Asha Rao",
    "bio": "I like swapping books and bike repairs.",
    "city": "Pune",
    "memberSince": "2026-11-06T10:00:00.000Z"
  }
}
```

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `400` | `Validation failed` | The id is not a valid id. `details` has the key `params.id`. |
| `404` | `User not found` | No user has this id, or the account is suspended |

## PATCH /users/me

Updates the profile of the current user. Send only the fields you want to change.

**Authentication:** The `accessToken` cookie.

Request body:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | string | No | 2 to 80 characters, trimmed |
| `city` | string | No | Up to 80 characters, trimmed. An empty string clears it. |
| `bio` | string | No | Up to 500 characters, trimmed. An empty string clears it. |

The body must contain at least one of these fields. Any other field, such as `role`, is ignored.

```json
{
  "city": "Pune",
  "bio": "I like swapping books and bike repairs."
}
```

Response `200`: `{ "user": { ... } }`, with the full user object and the new values.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `400` | `Validation failed` | A field breaks a rule, or the body has no allowed field. For an empty body, `details` is `{ "body": "Provide at least one field to update" }`. |
| `401` | `Authentication required` | The `accessToken` cookie is missing |
| `401` | `Invalid or expired token` | The access token is invalid or expired |
| `404` | `User not found` | The account no longer exists or is not active |

## PATCH /admin/users/:id/status

Suspends or reactivates an account. Suspending an account also revokes every refresh token of that user and blocks login.

**Authentication:** The `accessToken` cookie, for a user whose role is `admin`. The API reads the role from the database, not from the token.

Path parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | string | The id of the user to change |

Request body:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `status` | string | Yes | `active` or `suspended` |

```json
{ "status": "suspended" }
```

Response `200`: `{ "user": { ... } }`, with the full user object and the new `status`.

Errors:

| Status | Message | Cause |
| --- | --- | --- |
| `400` | `Validation failed` | The id or the status is invalid. The status message is `Status must be active or suspended`. |
| `400` | `You cannot change your own status` | The id belongs to the caller |
| `401` | `Authentication required` | The `accessToken` cookie is missing |
| `403` | `You do not have permission to do this` | The caller is not an active admin |
| `404` | `User not found` | No user has this id |

There is no endpoint that creates an admin. To make an admin, change the `role` field of a user in the database.
