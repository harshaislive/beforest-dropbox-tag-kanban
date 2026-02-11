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
    <div className="h-fit rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <h2 className="mb-3 text-sm font-semibold text-[#252525]">Leaderboard</h2>
      <ul className="space-y-2">
        {leaders.map((entry, i) => (
          <li key={entry.user_id} className="flex items-center justify-between rounded-md border border-black/10 bg-[#fafaf9] px-3 py-2 text-sm">
            <span className="truncate text-[#3a3a3a]">
              {i + 1}. {entry.display_name}
            </span>
            <strong className="text-[#1f1f1f]">{entry.tagged_count}</strong>
          </li>
        ))}
      </ul>
      {leaders.length === 0 && <p className="text-sm text-[#7a7a7a]">No tag activity yet.</p>}
    </div>
  );
}
