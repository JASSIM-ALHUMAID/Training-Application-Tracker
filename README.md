# Training Tracker

Training Tracker is a Next.js web application for managing training applications on a personal Kanban board. Each account gets one board with a default pipeline, and users can sign in, add applications, edit details, move cards between stages, and remove cards they no longer need.

## Key Features

- Email and password sign-up and sign-in with Better Auth
- Automatic board creation for each newly registered user
- Default application pipeline: `Wish List`, `Applied`, `Interviewing`, `Offer`, `Rejected`
- Create, edit, move, and delete training application cards
- MongoDB persistence through Mongoose models
- Optional seed script for loading demo applications into a user's board

## Table of Contents

- [Tech Stack](#tech-stack)
- [Current Scope](#current-scope)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Routes and User Flow](#routes-and-user-flow)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Development Notes](#development-notes)
- [Testing and Verification](#testing-and-verification)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Tech Stack

- **Framework**: Next.js 16.1.4 with the App Router
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4, `tw-animate-css`
- **Component primitives**: shadcn/ui and Radix UI
- **Authentication**: Better Auth
- **Database**: MongoDB
- **ODM**: Mongoose
- **Icons**: Lucide React
- **Linting**: ESLint with `eslint-config-next`
- **Package manager**: pnpm

## Current Scope

This repository currently implements the following behavior:

- One board per user, named `Training Tracker`
- Five default columns created automatically at sign-up time
- Card movement initiated from the card action menu
- Server actions for application create, update, move, and delete flows
- A seed script that can repopulate a specific user's board with demo data

It does **not** currently include:

- Multiple boards per user
- A checked-in `.env.example`
- A checked-in test suite
- A checked-in Dockerfile or platform deployment manifest
- A checked-in CI workflow

## Project Structure

```text
.
├── public/                         # Static files and landing-page assets
├── src/
│   ├── app/
│   │   ├── api/[...all]/route.ts   # Better Auth route handler
│   │   ├── dashboard/page.tsx      # Authenticated board page
│   │   ├── sign-in/page.tsx        # Sign-in form
│   │   ├── sign-up/page.tsx        # Sign-up form
│   │   ├── globals.css             # Tailwind and theme tokens
│   │   ├── layout.tsx              # Root layout and metadata
│   │   └── page.tsx                # Marketing landing page
│   ├── components/
│   │   ├── CreateTrainingApplicationDialog.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── NavBar.tsx
│   │   ├── SignOutButton.tsx
│   │   ├── TrainingApplicationCard.tsx
│   │   └── ui/                     # shadcn/ui primitives
│   ├── lib/
│   │   ├── actions/                # Server actions for training applications
│   │   ├── auth/                   # Better Auth server and client setup
│   │   ├── hooks/                  # Small client-side board hook
│   │   ├── models/                 # Mongoose schemas and shared types
│   │   ├── db.ts                   # Cached MongoDB connection helper
│   │   ├── init-user-board.ts      # Creates default board + columns
│   │   └── utils.ts                # UI utility helpers
│   ├── proxy.ts                    # Redirects signed-in users away from auth pages
│   └── scripts/
│       └── seed.ts                 # Demo data seed script
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs               # ESLint config
├── next.config.ts                  # Next.js config
├── package.json                    # Scripts and dependencies
├── pnpm-lock.yaml                  # Locked dependency graph
├── postcss.config.mjs              # Tailwind PostCSS setup
└── tsconfig.json                   # TypeScript config
```

## Prerequisites

Install the following before trying to run the project locally:

- Node.js 20 or newer
- pnpm
- A MongoDB instance
  - Local MongoDB is fine
  - MongoDB Atlas is also fine
- Git

Recommended but optional:

- MongoDB Compass for inspecting documents manually
- Docker, if you want a quick local MongoDB without installing it directly

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Training Tracker"
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs both runtime and development dependencies listed in `package.json`.

### 3. Create the Local Environment File

This repository does not currently include a `.env.example`, so create `.env.local` manually in the project root.

Example:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/training-tracker
NEXT_PUBLIC_AUTH_BASE_PATH=/api/auth
```

Notes:

- `MONGODB_URI` is required by both the app and the seed script.
- `NEXT_PUBLIC_AUTH_BASE_PATH` is required by the Better Auth client setup in `src/lib/auth/auth-client.ts`.
- The auth client and auth server path must agree. In this codebase, Better Auth is exposed through the catch-all route at `src/app/api/[...all]/route.ts`, and `/api/auth` is the expected default path unless you deliberately change your auth routing strategy.

### 4. Start MongoDB

If you already have MongoDB running locally or are using MongoDB Atlas, skip to the next step.

If you want a quick local MongoDB via Docker:

```bash
docker run --name training-tracker-mongo -p 27017:27017 -d mongo:7
```

If you prefer to verify the container is running:

```bash
docker ps
```

### 5. Start the Development Server

```bash
pnpm dev
```

This starts the Next.js development server.

Open the application at:

```text
http://localhost:3000
```

### 6. Create Your First Account

Navigate to `/sign-up`, create a user, and submit the form.

On successful sign-up:

- Better Auth creates the user record
- the `create.after` database hook in `src/lib/auth/auth.ts` runs
- `initializeUserBoard(user.id)` creates:
  - one board named `Training Tracker`
  - five default columns

You are then redirected to `/dashboard`.

### 7. Optional: Seed Demo Data

The seed script inserts sample training applications into the target user's board.

Important:

- The script requires `SEED_USER_ID`
- The script clears that user's existing training applications before re-seeding

Run it on macOS or Linux:

```bash
SEED_USER_ID=<your-user-id> pnpm seed
```

Run it in PowerShell:

```powershell
$env:SEED_USER_ID = "<your-user-id>"
pnpm seed
```

The script is defined as:

```json
"seed": "tsx --env-file=.env.local src/scripts/seed.ts"
```

That means `.env.local` is loaded automatically for the seed command.

If you need the user id, inspect your MongoDB data after sign-up using MongoDB Compass or your preferred shell tooling and copy the id for the account you want to seed.

## Environment Variables

These are the environment variables referenced directly in this codebase.

### Runtime Variables

| Variable | Required | Used In | Description |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes | `src/lib/db.ts`, `src/lib/auth/auth.ts` | MongoDB connection string used for both Mongoose models and the Better Auth Mongo adapter |
| `NEXT_PUBLIC_AUTH_BASE_PATH` | Yes | `src/lib/auth/auth-client.ts` | Public auth route prefix used by the Better Auth React client |

### Script-only Variables

| Variable | Required | Used In | Description |
| --- | --- | --- | --- |
| `SEED_USER_ID` | Only for `pnpm seed` | `src/scripts/seed.ts` | The user whose board should receive seeded demo applications |

### Example `.env.local`

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/training-tracker
NEXT_PUBLIC_AUTH_BASE_PATH=/api/auth
```

### Environment Notes

- `.env.local` is ignored by Git and should stay local to each machine.
- `NEXT_PUBLIC_AUTH_BASE_PATH` is exposed to the browser because it is prefixed with `NEXT_PUBLIC_`.
- If auth requests start failing in the browser, verify this path first.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server after a successful build |
| `pnpm lint` | Run ESLint across the project |
| `pnpm seed` | Run the demo data seed script using `.env.local` |

## Routes and User Flow

### Key Routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/sign-in` | Sign-in form |
| `/sign-up` | Sign-up form |
| `/dashboard` | Authenticated board page |
| `/api/...` | Better Auth catch-all route handler |

### User Flow

1. A visitor lands on `/` and can navigate to sign-in or sign-up.
2. The sign-up page calls `signUp.email(...)` from `src/lib/auth/auth-client.ts`.
3. Better Auth persists the user via the Mongo adapter.
4. The `create.after` hook in `src/lib/auth/auth.ts` creates the user's board and default columns.
5. The user is redirected to `/dashboard`.
6. `/dashboard` loads the current session and fetches the board plus nested columns and applications.
7. Card create, edit, move, and delete actions run as server actions and call `revalidatePath("/dashboard")` so the page refreshes with current data.

### Redirect Behavior

- `src/proxy.ts` redirects authenticated users away from `/sign-in` and `/sign-up` to `/dashboard`.
- `src/app/dashboard/page.tsx` redirects unauthenticated users back to `/sign-in`.

## Architecture

### High-level Overview

This app is a server-rendered Next.js application with a small set of client components layered on top for forms and interactive menus.

- Page-level data loading happens on the server.
- Authentication is handled by Better Auth.
- Domain data is stored in MongoDB and modeled with Mongoose.
- Data mutations are implemented with Next.js server actions.

### Request and Data Flow

```text
Browser
  -> Next.js route
    -> getSession()
    -> MongoDB-backed Better Auth session lookup
    -> dashboard board query
      -> Board
      -> populate Columns
      -> populate TrainingApplications
  -> rendered page

Mutations
  -> client component form/menu
  -> server action in src/lib/actions/training-application.ts
  -> MongoDB write
  -> revalidatePath("/dashboard")
  -> fresh server render
```

### Authentication

Authentication lives in `src/lib/auth/auth.ts` and `src/lib/auth/auth-client.ts`.

Server side:

- `betterAuth(...)` is configured with a MongoDB adapter
- email/password auth is enabled
- a session helper wraps `auth.api.getSession(...)`
- a database hook initializes a board immediately after user creation

Client side:

- `createAuthClient(...)` configures the browser auth client
- the auth client uses `NEXT_PUBLIC_AUTH_BASE_PATH`
- `useSession()` drives navbar behavior

### Board Initialization

`src/lib/init-user-board.ts` creates the default user workspace.

It performs these steps:

1. Connect to MongoDB
2. Check whether the user already has a board named `Training Tracker`
3. Create the board if it does not exist
4. Create the five default columns
5. Attach column ids back to the board

Default column order:

1. `Wish List`
2. `Applied`
3. `Interviewing`
4. `Offer`
5. `Rejected`

### Dashboard Loading

The dashboard page in `src/app/dashboard/page.tsx`:

- retrieves the current session
- redirects to `/sign-in` if there is no session
- queries the board by `userId` and board name
- performs a nested `populate(...)` so the page has board, columns, and cards in one shape
- uses `"use cache"` inside `getBoard(...)` for server-side caching

### Mutations

Training application changes live in `src/lib/actions/training-application.ts`.

Implemented actions:

- `createTrainingApplication(...)`
- `updateApplication(...)`
- `deleteTrainingApplication(...)`

These actions:

- confirm the session exists
- validate board ownership or application ownership
- update MongoDB documents
- call `revalidatePath("/dashboard")`

### Styling and UI

- Global theme tokens live in `src/app/globals.css`
- shadcn/ui configuration lives in `components.json`
- navigation and form UI are client components
- cards and dialogs are built from reusable UI primitives under `src/components/ui/`

## Data Model

This repository defines three main application collections. Better Auth also manages its own auth-related collections in MongoDB.

### `Board`

Defined in `src/lib/models/board.ts`.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Currently always `Training Tracker` |
| `userId` | `string` | Better Auth user id |
| `columns` | `ObjectId[]` | References `Column` documents |
| `createdAt` | `Date` | Added by Mongoose timestamps |
| `updatedAt` | `Date` | Added by Mongoose timestamps |

### `Column`

Defined in `src/lib/models/column.ts`.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Display name for the pipeline stage |
| `boardId` | `ObjectId` | Reference to parent board |
| `order` | `number` | Controls left-to-right column order |
| `trainingApplications` | `ObjectId[]` | References `TrainingApplication` documents |
| `createdAt` | `Date` | Added by Mongoose timestamps |
| `updatedAt` | `Date` | Added by Mongoose timestamps |

### `TrainingApplication`

Defined in `src/lib/models/training-application.ts`.

| Field | Type | Notes |
| --- | --- | --- |
| `company` | `string` | Required |
| `position` | `string` | Required |
| `location` | `string` | Optional |
| `status` | `string` | Defaults to `applied` on create |
| `columnId` | `ObjectId` | Reference to current column |
| `boardId` | `ObjectId` | Reference to parent board |
| `userId` | `string` | Owning user id |
| `order` | `number` | Used for card ordering inside a column |
| `notes` | `string` | Optional |
| `salary` | `string` | Optional |
| `jobUrl` | `string` | Optional external link |
| `appliedDate` | `Date` | Optional |
| `tags` | `string[]` | Optional free-form labels |
| `description` | `string` | Optional summary |
| `createdAt` | `Date` | Added by Mongoose timestamps |
| `updatedAt` | `Date` | Added by Mongoose timestamps |

### Relationship Model

```text
User (managed by Better Auth)
  -> Board
    -> Columns[]
      -> TrainingApplications[]
```

The app stores references in both directions where useful:

- a board keeps an ordered list of column ids
- a column keeps an ordered list of training application ids
- each training application also stores its `boardId` and `columnId`

This makes ownership checks and populate-based reads straightforward.

## Development Notes

### Key Files to Understand First

- `src/app/dashboard/page.tsx`
- `src/lib/auth/auth.ts`
- `src/lib/init-user-board.ts`
- `src/lib/actions/training-application.ts`
- `src/lib/db.ts`
- `src/lib/models/board.ts`
- `src/lib/models/column.ts`
- `src/lib/models/training-application.ts`
- `src/scripts/seed.ts`

### Current Implementation Details

- The navbar uses `useSession()` to toggle between auth links and dashboard/account controls.
- Card movement is currently driven by per-card dropdown actions, not drag and drop.
- The `useBoard` hook currently mirrors initial server data but does not implement optimistic reordering logic.
- Application updates and moves are persisted entirely through server actions.

### Seed Script Behavior

The seed script is intentionally destructive for the target user.

Before inserting sample applications it:

- finds the user's board
- deletes that user's existing `TrainingApplication` documents
- clears `trainingApplications` references from the user's columns

Use it only when you are comfortable replacing that user's current board contents.

## Testing and Verification

No automated test files are currently checked into this repository.

At the moment, the most reliable built-in verification steps are:

```bash
pnpm lint
pnpm build
```

### Recommended Manual Smoke Test

After local setup, verify the core flows in this order:

1. Visit `/sign-up`
2. Create a new account
3. Confirm you are redirected to `/dashboard`
4. Confirm the five default columns appear
5. Add a new training application
6. Edit that application
7. Move it to another column from the action menu
8. Delete it
9. Sign out
10. Sign back in and confirm persisted data loads correctly

### Seed Script Verification

If you use the seed script:

1. Sign up a fresh test user
2. Get the user's id from MongoDB
3. Run `pnpm seed` with `SEED_USER_ID`
4. Refresh `/dashboard`
5. Confirm each default column has demo applications

## Deployment

No deployment-specific config files are currently checked in.

That means there is no repository-owned setup yet for:

- Docker image builds
- Vercel configuration
- Render blueprints
- Railway manifests
- CI/CD pipelines

### What a Production Host Needs

At minimum, your host must provide:

- Node.js 20 or newer
- access to a MongoDB instance
- environment variables for:
  - `MONGODB_URI`
  - `NEXT_PUBLIC_AUTH_BASE_PATH`

### Generic Node Deployment Flow

On a Node-compatible host, the application can be started with the standard Next.js production flow:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

If your host exposes `PORT`, Next.js will respect it automatically.

### Platform Notes

- **Vercel**: should work as a standard Next.js deployment if the required environment variables are set and MongoDB is reachable from Vercel.
- **Render / Railway / VPS**: should work with the same `pnpm build` and `pnpm start` flow.
- **Docker**: application containerization is not set up yet because no `Dockerfile` is checked in.

### Production Checklist

Before your first real deployment, verify the following:

1. `pnpm build` succeeds locally
2. MongoDB is reachable from the deployment environment
3. `NEXT_PUBLIC_AUTH_BASE_PATH` matches your deployed auth route prefix
4. Sign-up, sign-in, and sign-out work in the deployed environment
5. Dashboard reads and writes persist correctly

## Troubleshooting

### `Please define the MONGODB_URI environment variable inside .env`

Cause:

- `MONGODB_URI` is missing or not loaded

Fix:

1. Create or update `.env.local`
2. Restart the dev server
3. Confirm the URI is valid

Example:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/training-tracker
```

### Auth requests fail in the browser

Cause:

- `NEXT_PUBLIC_AUTH_BASE_PATH` is incorrect

Fix:

1. Check `.env.local`
2. Confirm the client path matches the auth path you expect Better Auth to use
3. Restart the dev server after changing env values

### `/dashboard` keeps redirecting to `/sign-in`

Possible causes:

- session creation failed
- auth cookies are not being set correctly
- auth base path is misconfigured

Check:

1. browser network requests to auth endpoints
2. browser cookies after sign-in
3. MongoDB records for users and sessions

### Sign-up succeeds but the board is missing

Cause:

- the Better Auth user creation hook may have failed before `initializeUserBoard(...)` completed

Check:

1. server logs during sign-up
2. the `Board` collection for a document with the user's id
3. the `Column` collection for documents pointing at that board id

### `pnpm seed` fails immediately

Common causes:

- `SEED_USER_ID` was not provided
- `.env.local` does not contain a valid `MONGODB_URI`
- the target user or board does not exist yet

Fix:

1. Sign up the target user first
2. Confirm the user id is correct
3. Confirm MongoDB is reachable

### Data disappeared after seeding

Cause:

- this is expected behavior for the target user

The seed script deletes that user's existing training applications before inserting demo data.

### `pnpm build` fails on your machine

Check:

1. your Node version is 20+
2. dependencies were installed with `pnpm install`
3. required environment variables are present

## License

No license file is currently checked into this repository.
