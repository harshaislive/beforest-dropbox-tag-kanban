import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-3 text-3xl font-bold">Dropbox Image Tagging Kanban</h1>
      <p className="mb-6 text-slate-600">PostgreSQL + Prisma + NextAuth credentials setup for immediate deployment.</p>
      <div className="flex gap-3">
        <Link href="/auth/login" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
          Sign in
        </Link>
        <Link href="/auth/signup" className="rounded-lg border border-border px-4 py-2 text-slate-900">
          Sign up
        </Link>
      </div>
    </main>
  );
}
