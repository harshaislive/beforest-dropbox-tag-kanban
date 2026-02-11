# Dropbox Tag Kanban MVP (Postgres Edition)

Minimal, responsive Dropbox image tagging workflow scaffold using PostgreSQL + Prisma + NextAuth Credentials auth.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth (Credentials provider: email/password)

## What is implemented
- ✅ Signup page (`/auth/signup`) for email/password accounts
- ✅ Login page (`/auth/login`) with NextAuth credentials flow
- ✅ Protected dashboard (`/dashboard`) via middleware + server-side auth checks
- ✅ Prisma schema + SQL migration for:
  - `users`
  - `sessions`
  - `image_assets`
  - `image_tags`
  - `tag_events`
- ✅ Board read/write APIs via Prisma (no Supabase):
  - `GET /api/board`
  - `POST /api/tags`
  - `POST /api/assets/:id/status`
- ✅ Leaderboard API via Prisma:
  - `GET /api/leaderboard`
- ✅ Dropbox ingest/writeback placeholders retained:
  - `POST /api/dropbox/ingest`
  - `POST /api/dropbox/writeback`

## Project structure
```txt
app/
  auth/login/page.tsx
  auth/signup/page.tsx
  dashboard/page.tsx
  api/auth/[...nextauth]/route.ts
  api/signup/route.ts
  api/board/route.ts
  api/tags/route.ts
  api/assets/[id]/status/route.ts
  api/leaderboard/route.ts
  api/dropbox/ingest/route.ts
  api/dropbox/writeback/route.ts
components/
  AuthForm.tsx
  KanbanBoard.tsx
  ImageCard.tsx
  Leaderboard.tsx
  SignOutButton.tsx
lib/
  prisma.ts
  types.ts
prisma/
  schema.prisma
  migrations/0001_init/migration.sql
  init.sql
auth.ts
middleware.ts
```

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Update `.env.local` values.
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Apply migration:
   ```bash
   npx prisma migrate deploy
   ```
   For local iterative development, you can use:
   ```bash
   npx prisma migrate dev
   ```
6. (Optional) Seed sample assets:
   ```bash
   psql "$DATABASE_URL" -f prisma/init.sql
   ```
7. Run app:
   ```bash
   npm run dev
   ```

## Required environment variables
```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_APP_URL=
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=
DROPBOX_SOURCE_FOLDER=
DROPBOX_TARGET_MODE=
```

## Deployment notes
- Set all environment variables in your hosting platform.
- Run migrations on deploy (`npm run prisma:migrate`).
- Ensure `NEXTAUTH_URL` is the production app URL.
- Use a strong random `NEXTAUTH_SECRET` (32+ chars).

## Dropbox integration status
Current Dropbox endpoints are intentionally placeholders and return `501 Not Implemented`.

### Still needed for full Dropbox sync
- OAuth refresh token flow handling
- Folder scan + upsert strategy
- Writeback target strategy (`metadata` or `sidecar`)
- Conflict handling for external tag edits
- Trigger strategy (manual, webhook, cron)

## Security
- No secrets are committed.
- Passwords are hashed with bcrypt before storing in PostgreSQL.
