---
title: "0001: Use JavaScript, not TypeScript"
type: decision
last_verified: unverified
---

# 0001: Use JavaScript, not TypeScript

Status: Accepted

## Context

Barter Hub is built by one developer who had not used TypeScript before. TypeScript catches many mistakes before the code runs and is common in professional projects. Learning it while building a large application would slow the first release.

## Decision

Write the whole project in JavaScript. Reduce the risk in other ways:

- Validate all incoming data with Zod, on both the API and the web app.
- Run ESLint on both projects.
- Keep files small and keep each layer focused on one job.

## Consequences

- Type mistakes appear at run time, not while editing. Validation and future automated tests are the safety net.
- The project can move to TypeScript one file at a time, because both languages can exist in the same project.
- Zod schemas already describe the shape of every request, which makes a later migration easier.
