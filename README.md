# Barter Hub

Barter Hub is a web marketplace where people swap things and skills instead of paying money. It is open to the general public: a member lists something they have, finds something they need, and proposes a trade.

## Status

Barter Hub is under active development and is not released yet. The account system and the category list work today. Listings and the trading flow, which are the core of the product, are the next milestone.

| Area | Working today | Planned |
| --- | --- | --- |
| Accounts | Registration, login, logout, sign out everywhere, profile editing | Email verification, password reset |
| Marketplace | Category list (16 starter categories) | Listings for things and services, photos, search, offers, chat |
| Safety | Role-based access, account suspension by admins | Reviews, reports, moderation queue |
| AI | Not started | Suggested categories for new listings |
| Operations | Linting, formatting, documentation checks | Automated tests, CI/CD, deployment |

## Tech stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Web app | Next.js 16 (App Router), React, Tailwind CSS | Pages, forms, and styling |
| Forms | React Hook Form, Zod | Form state and validation in the browser |
| API | Node.js, Express 5 | HTTP endpoints under `/api` |
| Data | MongoDB Atlas, Mongoose 9 | Storage and data models |
| Security | bcryptjs, jsonwebtoken, Helmet, express-rate-limit, Zod | Password hashing, sessions, headers, rate limits, validation |
| Tooling | ESLint, Prettier, Git, GitHub Actions | Code quality and documentation checks |

The whole project is written in JavaScript. See [decision 0001](docs/decisions/0001-use-javascript.md) for the reasoning.

## Quick start

You need Node.js 20.19 or later, Git, and a MongoDB Atlas cluster. The [getting started guide](docs/getting-started.md) walks through each step, including the Atlas setup.

```bash
git clone https://github.com/singhketan5973-eng/ks-barter-hub.git
cd ks-barter-hub

# Terminal 1: API (from the project root)
cd server
cp .env.example .env        # then set MONGODB_URI and JWT_ACCESS_SECRET
npm install
npm run seed:categories
npm run dev

# Terminal 2: web app (from the project root)
cd client
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>. The API health check is at <http://localhost:5000/api/health>.

## Project structure

```text
ks-barter-hub/
├── client/            Next.js web app (pages, components, API helpers)
├── server/            Express API (routes, controllers, services, models)
├── docs/              Guides, architecture, API reference, decision records
├── tools/             Documentation checker (Python)
└── .github/workflows/ Automated documentation checks
```

Each of `client/` and `server/` has its own README with its commands and folder layout.

## Documentation

| Document | Type | What it covers |
| --- | --- | --- |
| [Getting started](docs/getting-started.md) | Task | Set up and run Barter Hub locally |
| [Architecture](docs/architecture.md) | Concept | How the web app, API, and database fit together |
| [Security](docs/security.md) | Concept | How passwords, sessions, and cookies are protected, and known limits |
| [API reference](docs/api/overview.md) | Reference | Every endpoint, with requests, responses, and errors |
| [Decision records](docs/decisions/0001-use-javascript.md) | Decision | Why the main technical choices were made |
| [Style guide](docs/style-guide.md) | Reference | Writing rules and terminology for these documents |
| [Changelog](CHANGELOG.md) | Reference | What changed, in order |

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the commit style, the checks to run before committing, and how documentation is verified.

## License

No license has been chosen yet. Until one is added, all rights are reserved by the project owner.
