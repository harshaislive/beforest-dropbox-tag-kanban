'use client';

import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';

export function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard').then((r) => r.json()).then((j) => setRows(j.rows || []));
  }, []);

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold">Leaderboard</h2>
      <ul className="space-y-2">
        {rows.map((entry, i) => (
          <li key={entry.user_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span>{i + 1}. {entry.display_name}</span>
            <strong>{entry.tagged_count}</strong>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-slate-500">No activity yet.</li>}
      </ul>
    </div>
  );
}
