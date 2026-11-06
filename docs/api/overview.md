---
title: API overview
type: reference
last_verified: unverified
---

# API overview

This page describes the rules that apply to every Barter Hub API endpoint. Endpoint details are in [Authentication](auth.md), [Users](users.md), and [Categories](categories.md).

## Base URL

| Environment | Base URL |
| --- | --- |
| Local development | `http://localhost:5000/api` |

Every path in this reference is relative to the base URL. For example, `/health` means `http://localhost:5000/api/health`.

## Requests and responses

- Requests and responses use JSON. Send the header `Content-Type: application/json` when a request has a body.
- A request with a body larger than 1 MB is rejected with status `413`.
- Fields that an endpoint does not list are ignored.

## Authentication

Protected endpoints read an `accessToken` cookie. The cookie is set by [`POST /auth/login`](auth.md#post-authlogin). A browser sends it automatically when the request includes credentials.

| Cookie | Path | Lifetime | Purpose |
| --- | --- | --- | --- |
| `accessToken` | `/` | 15 minutes by default | Proves who is calling |
| `refreshToken` | `/api/auth` | 7 days by default | Gets a new token pair from [`POST /auth/refresh`](auth.md#post-authrefresh) |

Both cookies are `httpOnly` and `SameSite=Lax`, and they are `Secure` in production.

## Errors

Every error uses the same JSON shape.

```json
{
  "message": "Validation failed",
  "details": {
    "body.email": "Enter a valid email address"
  }
}
```

| Field | Present | Description |
| --- | --- | --- |
| `message` | Always | A readable explanation that is safe to show to a person |
| `details` | For validation errors | An object that maps a field, such as `body.email`, to its message |
| `stack` | Only in development, for unexpected errors | The stack trace, for debugging |

## Status codes

| Status | Meaning | Example |
| --- | --- | --- |
| `200` | Success, with a body | A profile is returned |
| `201` | Created | A new account |
| `204` | Success, no body | Logout |
| `400` | The request is invalid | Validation failed, invalid JSON, or an invalid id |
| `401` | Authentication is missing or invalid | No cookie, or an expired token |
| `403` | Authenticated, but not allowed | A normal user calls an admin endpoint |
| `404` | Not found | An unknown route or user |
| `409` | Conflict | The email is already registered |
| `413` | The request body is too large | |
| `429` | Too many requests | A rate limit was reached |
| `500` | Unexpected server error | The message is always `Internal server error` |

## Rate limits

| Scope | Limit |
| --- | --- |
| All endpoints | 300 requests per 15 minutes per IP address |
| `POST /auth/register` and `POST /auth/login` | 10 requests per 15 minutes per IP address in production, 100 in development |
| `POST /auth/refresh` | 60 requests per 15 minutes per IP address in production, 300 in development |

When a limit is reached, the API returns `429`. The response includes `RateLimit` headers that show the limit and the remaining requests.

## Health check

### GET /health

Returns the status of the API. It needs no authentication.

Response `200`:

```json
{
  "status": "ok",
  "uptime": 12,
  "timestamp": "2026-11-06T10:00:00.000Z"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Always `ok` |
| `uptime` | integer | Seconds since the API started |
| `timestamp` | string | The current time in ISO 8601 format |
