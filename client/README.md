# Barter Hub web app

The Next.js web app for Barter Hub. It uses the App Router, Tailwind CSS, and JavaScript.

## Commands

Run these from the `client` folder.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server at <http://localhost:3000> |
| `npm run build` | Creates a production build |
| `npm start` | Runs the production build |
| `npm run lint` | Reports code problems |
| `npm run format` | Rewrites files into the project style |

## Settings

Copy `.env.example` to `.env.local` and set the value.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base address of the API, for example `http://localhost:5000/api` |

Variables that start with `NEXT_PUBLIC_` are sent to every visitor's browser. Never put a secret in one.

## Folder layout

```text
src/
├── app/
│   ├── (auth)/        Login and register pages, with a minimal layout
│   ├── (site)/        Pages with the header and footer, including /account
│   ├── globals.css    Design tokens and base styles
│   └── layout.js      Root layout, fonts, and the session provider
├── components/
│   ├── account/       Profile form and sessions card
│   ├── auth/          Session provider, login and register forms, page guard
│   ├── layout/        Header and footer
│   └── ui/            Button, Input, Textarea, FormField, Alert
└── lib/               API helper, validation rules, small utilities
```

Folders in parentheses, such as `(auth)`, group pages without changing the URL. See the [architecture overview](../docs/architecture.md) for how the web app talks to the API.
