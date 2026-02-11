# Dropbox Tag Kanban MVP

Minimal scaffold for a Dropbox image tagging workflow with a Kanban UI and Supabase magic-link auth.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase JS (`@supabase/supabase-js`)

## Included in this MVP scaffold
- ✅ Magic-link auth page (`/auth/login`)
- ✅ Protected dashboard (`/dashboard`) with Kanban columns:
  - `to_tag`
  - `tagged`
  - `in_review`
  - `approved`
- ✅ Image card component with preview and tag chips
- ✅ Basic leaderboard view
- ✅ Supabase SQL schema at `supabase/schema.sql` (local-first tag event model)
- ✅ API placeholders:
  - `POST /api/dropbox/ingest`
  - `POST /api/dropbox/writeback`

## Project Structure
```txt
app/
  auth/login/page.tsx
  dashboard/page.tsx
  api/dropbox/ingest/route.ts
  api/dropbox/writeback/route.ts
components/
  AuthForm.tsx
  KanbanBoard.tsx
  ImageCard.tsx
  Leaderboard.tsx
lib/
  supabase.ts
  types.ts
supabase/
  schema.sql
```

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
3. Fill `.env.local` with your Supabase values.
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Supabase Setup
1. Create a new Supabase project.
2. Enable Email auth (magic link) in Auth settings.
3. Add redirect URL:
   - `http://localhost:3000/dashboard`
   - production dashboard URL later
4. Run SQL from `supabase/schema.sql` in Supabase SQL Editor.

## Deploy (example: Vercel)
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Add production redirect URL in Supabase Auth.

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=
DROPBOX_SOURCE_FOLDER=
DROPBOX_TARGET_MODE=
```

## Dropbox Integration Status
Current endpoints are placeholders returning `501 Not Implemented`.

### Needed for ingest implementation
- Dropbox app credentials
- OAuth refresh token flow
- Source folder selection
- Mapping strategy from Dropbox file metadata -> `image_assets`

### Needed for writeback implementation
- Decide writeback mode (`metadata` or `sidecar`)
- Dropbox API scopes for file read/write
- Conflict strategy (if image tags changed externally)
- Sync job trigger mode (manual button, webhook, or cron)

## Notes
- This is intentionally minimal and responsive.
- No real secrets are stored in this repo.
- Kanban currently uses demo in-memory data; wire to Supabase queries next.
