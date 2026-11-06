---
title: Getting started
type: task
last_verified: unverified
---

# Getting started

This guide shows how to run Barter Hub on your own computer. When you finish, the API runs on port 5000, the web app runs on port 3000, and you can create an account in your browser.

## Before you begin

You need:

- Node.js 20.19 or later. Check with `node -v`.
- Git. Check with `git --version`.
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account.
- Two terminal windows.

## Step 1: Get the code

```bash
git clone https://github.com/singhketan5973-eng/ks-barter-hub.git
cd ks-barter-hub
```

## Step 2: Create a database

1. In Atlas, create a free cluster.
2. Open **Database Access** and create a database user. Use a password with only letters and numbers, because symbols can break the connection string. Give the user the **Read and write to any database** role.
3. Open **Network Access** and add your current IP address.
4. Open your cluster, choose **Connect**, then **Drivers**, and copy the connection string.
5. In the string, replace `<db_password>` with your password, and add the database name `barter-hub` between the `/` and the `?`.

The result looks like this:

```text
mongodb+srv://myuser:mypassword@mycluster.abc12.mongodb.net/barter-hub?appName=mycluster
```

## Step 3: Configure the API

1. Go to the `server` folder:

   ```bash
   cd server
   ```

2. Copy the example settings file. On macOS and Linux:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Generate a secret for signing access tokens, and copy the output:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
   ```

4. Open `.env` and set these values:

   ```text
   MONGODB_URI=<your connection string from Step 2>
   CLIENT_URL=http://localhost:3000
   JWT_ACCESS_SECRET=<the secret you generated>
   ```

   Leave the other values as they are. Do not add quotes or spaces around the values. See the [API settings table](../server/README.md#settings) for every option.

## Step 4: Start the API

Still in the `server` folder, run:

```bash
npm install
npm run seed:categories
npm run dev
```

The seed command prints `Categories created: 16, already existed: 0`. The `npm run dev` command prints:

```text
MongoDB connected: barter-hub
Server running on port 5000 (development)
```

Leave this terminal open.

## Step 5: Check the API

Open <http://localhost:5000/api/health> in your browser. You see a response like this:

```json
{ "status": "ok", "uptime": 12, "timestamp": "2026-11-06T10:00:00.000Z" }
```

## Step 6: Start the web app

In the second terminal, from the project root:

```bash
cd client
```

Copy the example settings file to `.env.local` (use `cp` or `Copy-Item` as in Step 3), then run:

```bash
npm install
npm run dev
```

The terminal prints `Local: http://localhost:3000`.

## Step 7: Create an account

1. Open <http://localhost:3000/register>.
2. Enter a name, an email address, and a password with at least 8 characters, including a letter and a number.
3. Select **Create account**. You land on the login page with a green confirmation message.
4. Log in. The header now shows your name and a **Log out** button.

To confirm the account exists, open your Atlas database. The `users` collection holds a document for your email, and its `passwordHash` field starts with `$2b$12$`. The password itself is never stored.

## Optional: Make an admin account

Registration always creates a normal user. To create an admin:

1. In Atlas, open the `users` collection and find your user.
2. Change the `role` field from `"user"` to `"admin"`.
3. Log out and log in again.

Admins can suspend and reactivate accounts. See the [user endpoints](api/users.md).

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Invalid environment variables` when the API starts | A setting in `.env` is missing or invalid | Read the list under the message. It names the setting. |
| `Could not connect to any servers` | Atlas blocks your IP address | Add your current IP in Atlas under **Network Access**, wait a minute, and restart the API. |
| `bad auth` or `Authentication failed` | Wrong database username or password | Check `MONGODB_URI`. The password must not include `<` or `>`. |
| The browser console shows a CORS error | `CLIENT_URL` does not match the web app address | Set `CLIENT_URL=http://localhost:3000` exactly, then restart the API. |
| `npm error ENOENT ... package.json` | You ran the command in the wrong folder | Run `npm` commands inside `server` or `client`. |
| A setting change has no effect | The API reads `.env` only at startup | Stop the API with Ctrl + C and start it again. |
| `EADDRINUSE` | Port 5000 or 3000 is already in use | Stop the other process that is running the app. |
