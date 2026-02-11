'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Leaderboard } from '@/components/Leaderboard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/auth/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <main className="p-6 text-sm text-slate-500">Loading dashboard...</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tagging Dashboard</h1>
          <p className="text-sm text-slate-600">Protected workspace with local-first tagging interactions.</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/auth/login');
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          Sign out
        </button>
      </header>

      <div className="mb-6">
        <Leaderboard />
      </div>
      <KanbanBoard />
    </main>
  );
}
