---
title: "0004: Define the design as three layers of tokens"
type: decision
last_verified: unverified
---

# 0004: Define the design as three layers of tokens

Status: Accepted

## Context

The site must look consistent, and it must be easy to change later, for example to adjust the brand colors or to add a dark theme. If components contain raw color values, every change touches many files.

## Decision

Define the design in `client/src/app/globals.css` as three layers:

| Layer | Example | Purpose |
| --- | --- | --- |
| Primitives | `--color-forest-600` | The raw palette. Components do not use it directly. |
| Semantic tokens | `--primary`, `--surface`, `--foreground-muted` | What a color means |
| Utilities | `bg-primary`, `text-foreground-muted` | What components use |

Components use only the utility names that come from semantic tokens. Fonts are loaded with `next/font`: Fraunces for headings and Public Sans for body text.

## Consequences

- A rebrand changes a few lines in one file.
- A dark theme needs a second set of semantic values, plus a check of every color pair for contrast. It is postponed until after the first release.
- Contributors must not write raw color values in components.
