import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Leaderboard } from '@/components/Leaderboard';
import { SignOutButton } from '@/components/SignOutButton';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tagging Dashboard</h1>
          <p className="text-sm text-slate-600">Protected PostgreSQL-backed tagging workspace.</p>
        </div>
        <SignOutButton />
      </header>

      <div className="mb-6">
        <Leaderboard />
      </div>
      <KanbanBoard />
    </main>
  );
}
