# Contributing

This guide explains how to make a change to Barter Hub and what to check before you commit.

## Workflow

Barter Hub is currently developed on the `main` branch by one developer. When more people contribute, use a feature branch for each change and open a pull request.

1. Make one focused change.
2. Run the checks for the part you changed (see below).
3. Run `git status` and read the list. Confirm that no `.env` file and no test scripts are included.
4. Commit with a message in the format described below.

## Commit messages

Start every message with a type, a colon, and a short description in the present tense.

| Type | Use for |
| --- | --- |
| `feat:` | A new capability |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `refactor:` | A code change that does not alter behavior |
| `style:` | Formatting only |
| `test:` | Adding or changing tests |
| `chore:` | Setup, dependencies, and maintenance |

Example: `feat: add refresh token rotation, logout and sign-out-everywhere`

## Checks to run

Run these from the folder that contains the `package.json` you changed.

```bash
npm run lint
npm run format
```

`npm run lint` reports problems and should print nothing else when the code is clean. `npm run format` rewrites files into the project style.

For documentation, run this from the project root:

```bash
python tools/docs_check.py
```

## Secrets

Never commit a real secret. The files `server/.env` and `client/.env.local` are ignored by Git on purpose. The `.env.example` files hold placeholders only. If a secret is committed by mistake, treat it as exposed: replace it at its source first, then clean the history.

## Documentation changes

Write documentation in the same commit as the feature it describes, and use the `docs:` prefix when a commit changes only documentation.

Every file under `docs/` starts with a front matter block:

```yaml
---
title: Getting started
type: task
last_verified: unverified
---
```

- `type` is one of `task`, `concept`, `reference`, `decision`, or `index`.
- `last_verified` is `unverified` or a date in `YYYY-MM-DD` format.

A document can be drafted with AI assistance, but a person must check every statement against the running product before setting `last_verified` to a date. To verify a document:

1. Follow each step or run each request exactly as written, on a clean setup where possible.
2. Correct anything that differs from the real behavior.
3. Set `last_verified` to today's date.

Do not paste secrets, real connection strings, or user data into any AI tool.
