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
    <main className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#1f1f1f]">Dropbox Tagging Workspace</h1>
            <p className="text-sm text-[#6b6b6b]">Notion-style review board for image QA, tagging, and approvals.</p>
          </div>
          <SignOutButton />
        </header>

        <div className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <KanbanBoard />
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
