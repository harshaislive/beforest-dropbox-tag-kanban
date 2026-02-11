'use client';

import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const json = (await res.json()) as { ok: boolean; data?: LeaderboardEntry[] };
      setLeaders(json.data ?? []);
    };
    load();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold">Leaderboard</h2>
      <ul className="space-y-2">
        {leaders.map((entry, i) => (
          <li key={entry.user_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span>
              {i + 1}. {entry.display_name}
            </span>
            <strong>{entry.tagged_count}</strong>
          </li>
        ))}
      </ul>
      {leaders.length === 0 && <p className="text-sm text-slate-500">No tag activity yet.</p>}
    </div>
  );
}
