# Barter Hub API

The Express API for Barter Hub. It serves JSON under `/api`, stores data in MongoDB, and manages login sessions with cookies.

## Commands

Run these from the `server` folder.

| Command                   | What it does                                                |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | Starts the API and restarts it when a file changes          |
| `npm start`               | Starts the API without restarting                           |
| `npm run seed:categories` | Adds the 16 starter categories. Safe to run more than once. |
| `npm run lint`            | Reports code problems                                       |
| `npm run format`          | Rewrites files into the project style                       |

## Settings

Copy `.env.example` to `.env` and set the values. The API validates them at startup and stops with a clear message if one is missing or invalid.

| Variable                 | Required | Default                 | Description                                                         |
| ------------------------ | -------- | ----------------------- | ------------------------------------------------------------------- |
| `NODE_ENV`               | No       | `development`           | `development`, `test`, or `production`                              |
| `PORT`                   | No       | `5000`                  | Port the API listens on                                             |
| `MONGODB_URI`            | Yes      | None                    | MongoDB Atlas connection string, including the database name        |
| `CLIENT_URL`             | No       | `http://localhost:5173` | Web app address allowed by CORS. Set it to `http://localhost:3000`. |
| `JWT_ACCESS_SECRET`      | Yes      | None                    | Secret that signs access tokens. At least 32 characters.            |
| `JWT_ACCESS_EXPIRES_IN`  | No       | `15m`                   | Access token lifetime                                               |
| `REFRESH_TOKEN_TTL_DAYS` | No       | `7`                     | Refresh token lifetime in days, from 1 to 90                        |

## Folder layout

```text
src/
├── config/        Settings and the database connection
├── controllers/   Read the request, call a service, send the response
├── middleware/    Authentication, validation, rate limits, error handling
├── models/        Mongoose schemas: User, RefreshToken, Category
├── routes/        URL paths mapped to middleware and controllers
├── services/      Business rules
├── utils/         Small shared helpers
├── validators/    Zod schemas for request data
├── app.js         Builds the Express app
└── server.js      Connects to the database and starts listening
scripts/           One-off scripts, such as the category seed
```

See the [architecture overview](../docs/architecture.md) for how the layers work together, and the [API reference](../docs/api/overview.md) for every endpoint.
