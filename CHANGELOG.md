# Changelog

All notable changes to Barter Hub are listed here. The project has no numbered release yet, so every entry is under Unreleased.

## Unreleased

### Added

- API: Express 5 server with security headers, CORS, request logging, and rate limits.
- API: A consistent JSON error format, and request validation with Zod.
- API: User registration, login, logout, and "sign out everywhere".
- API: Sessions with a 15-minute access token and a rotating 7-day refresh token, both stored in `httpOnly` cookies.
- API: Public user profiles, profile editing, and admin-only account suspension and reactivation.
- API: A public category list, and a script that seeds 16 starter categories.
- Web app: Next.js app with a design system (colors, fonts, and base styles) and reusable form components.
- Web app: Registration and login screens, a header that shows the signed-in user, and silent session renewal.
- Web app: A protected account page with profile editing and a "Sign out everywhere" button.
- Documentation: README, setup guide, architecture, security notes, API reference, decision records, and a documentation checker.
