# Training Tracker

Training Tracker is a small Kanban-style web app for organizing training applications. Each user gets a personal board with default pipeline columns and can create, edit, move, and delete application cards.

## Features

- Email/password sign-up and sign-in
- Automatic per-user board creation
- Default columns: `Wish List`, `Applied`, `Interviewing`, `Offer`, `Rejected`
- Create, edit, move, and delete training application cards
- Seed demo data for a specific user

## Tech Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `shadcn/ui` and `Radix UI`
- `better-auth`
- `MongoDB` with `Mongoose`

## Project Structure

```text
src/
├── app/                  # App Router pages and auth API route
├── components/           # UI and board components
├── lib/
│   ├── actions/          # Server actions for application CRUD
│   ├── auth/             # better-auth server/client setup
│   ├── hooks/            # Client-side board hook
│   ├── models/           # Mongoose models and TS types
│   ├── db.ts             # MongoDB connection helper
│   └── init-user-board.ts
├── proxy.ts              # Redirect logic for auth pages
└── scripts/
    └── seed.ts           # Demo data seed script
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm seed
```

## Seed Demo Data

The seed script inserts sample training applications into the default board for a specific user.

macOS/Linux:

```bash
SEED_USER_ID=<your-user-id> pnpm seed
```

PowerShell:

```powershell
$env:SEED_USER_ID="<your-user-id>"
pnpm seed
```

The script also reads `MONGODB_URI` from `.env.local` because the command is defined as:

```json
"seed": "tsx --env-file=.env.local src/scripts/seed.ts"
```

## Key Files

- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/sign-in/page.tsx`
- `src/app/sign-up/page.tsx`
- `src/app/api/[...all]/route.ts`
- `src/lib/auth/auth.ts`
- `src/lib/auth/auth-client.ts`
- `src/lib/init-user-board.ts`
- `src/lib/actions/training-application.ts`
- `src/lib/models/board.ts`
- `src/lib/models/column.ts`
- `src/lib/models/training-application.ts`
- `src/scripts/seed.ts`
