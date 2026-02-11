# Dropbox Tag Kanban MVP

Minimal, responsive Dropbox image tagging Kanban with **Postgres-only** auth/data (no Supabase).

## Stack
- Next.js 14 + TypeScript + Tailwind
- PostgreSQL + Prisma
- NextAuth (Credentials: email/password)

## What’s included
- Login + signup
- Protected dashboard
- Kanban columns: `to_tag`, `tagged`, `in_review`, `approved`
- Leaderboard API
- Dropbox ingest/writeback placeholders

## Setup
```bash
cp .env.example .env.local
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Required env vars
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Dropbox vars in `.env.example`

## Seed first admin (optional)
Create user from `/auth/signup`, then update role in DB:
```sql
update "User" set role='admin' where email='you@example.com';
```

## Deployment notes
- Set env vars in Coolify.
- Run build command: `npm run build`
- Start command: `npm run start`
- Ensure DB is reachable from app container.
