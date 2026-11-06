---
title: Style guide
type: reference
last_verified: unverified
---

# Style guide

These rules keep the Barter Hub documentation clear and consistent. The documentation checker enforces the structure rules and the terminology list.

## Document types

Every document in `docs/` has one type, set in its front matter.

| Type | Purpose | Shape |
| --- | --- | --- |
| `task` | Help the reader finish a job | Numbered steps, each with one action and its expected result |
| `concept` | Explain how something works and why | Short sections, diagrams, and tables |
| `reference` | List exact facts | Tables, and the same layout for every item |
| `decision` | Record why a choice was made | Context, decision, consequences |
| `index` | Point to other documents | A table of links |

## Writing rules

1. Start with the reader's goal. Say what the reader will have when they finish.
2. Write steps in the imperative, with one action per step: "Run `npm install`."
3. Show the expected output after a command, so the reader can tell it worked.
4. Use the present tense and the active voice: "The API rejects the request."
5. Keep sentences short. Use one idea per sentence.
6. Define a term the first time it appears.
7. Use one name for one thing. Follow the terminology list below.
8. Avoid marketing words such as "powerful", "seamless", and "robust".
9. Put commands, file names, and values in code formatting.
10. Do not paste real secrets, connection strings, or user data. Use obvious placeholders.
11. Test every step before you publish it.

## Formatting

- Use sentence case for headings: "Getting started", not "Getting Started".
- Use one level-1 heading per file, and do not skip heading levels.
- Add a language to every code block, for example `bash`, `json`, or `text`.
- Use tables for comparisons and lists of options. Use numbered lists for steps and bullet lists for everything else.
- Link to other documents with relative paths.

## Terminology

The checker reads `tools/terminology.json` and reports any discouraged form in prose. Discouraged forms are shown in code formatting here so the checker does not flag this page.

| Use | Do not use | Note |
| --- | --- | --- |
| access token | `auth token`, `access-token` | The short-lived token, valid for 15 minutes |
| refresh token | `renewal token`, `refresh-token` | The single-use token that issues new tokens |
| sign out everywhere | `global logout`, `log out everywhere` | Ends every session of one user |
| email | `e-mail`, `E-mail` | |
| MongoDB Atlas | `Mongo Atlas`, `Atlas DB` | |
| Next.js | `NextJS`, `Next JS`, `Nextjs` | |
| Node.js | `NodeJS`, `Node JS`, `Nodejs` | |
| JavaScript | `Javascript`, `javascript` | |
| GitHub | `Github` | |
| Barter Hub | `BarterHub`, `Barter-Hub` | |

Two more conventions are not checked automatically:

- Write **log in** (two words) for the action and **login** (one word) for the noun or adjective, as in "log in to your account" and "the login page".
- Write **user** in technical documents. Write **member** only when you describe the product to a person who uses it.
