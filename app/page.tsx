import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-3 text-3xl font-bold">Dropbox Image Tagging Kanban</h1>
      <p className="mb-6 text-slate-600">MVP scaffold with Supabase magic-link authentication.</p>
      <Link href="/auth/login" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
        Continue to Login
      </Link>
    </main>
  );
}
