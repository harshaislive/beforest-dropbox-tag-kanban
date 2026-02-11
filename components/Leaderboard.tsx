import { LeaderboardEntry } from '@/lib/types';

const demoLeaders: LeaderboardEntry[] = [
  { user_id: 'u1', display_name: 'Asha', tagged_count: 42 },
  { user_id: 'u2', display_name: 'Ravi', tagged_count: 35 },
  { user_id: 'u3', display_name: 'Mina', tagged_count: 28 }
];

export function Leaderboard() {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold">Leaderboard</h2>
      <ul className="space-y-2">
        {demoLeaders.map((entry, i) => (
          <li key={entry.user_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span>
              {i + 1}. {entry.display_name}
            </span>
            <strong>{entry.tagged_count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
