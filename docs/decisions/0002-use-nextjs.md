---
title: "0002: Use Next.js for the web app"
type: decision
last_verified: unverified
---

# 0002: Use Next.js for the web app

Status: Accepted

## Context

Barter Hub is a public marketplace. Many visitors will arrive from a search engine, looking for an item or a service. A plain React app sends an empty page and fills it in with JavaScript, which search engines handle less reliably.

## Decision

Build the web app with Next.js and its App Router, in JavaScript. Render public pages on the server, and use client components only for interactive parts such as forms and the header.

The Express API stays a separate application, so a future mobile app can use the same endpoints.

## Consequences

- Public pages, such as listings and profiles, can be read by search engines.
- The team learns the difference between server components and client components.
- Cookie-based login across two applications needs a shared parent domain in production, for example `app.example.com` and `api.example.com`. See the [security notes](../security.md#known-limits).
- Pages that need a login are guarded in the browser. The API remains the real protection.
