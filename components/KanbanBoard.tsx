'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImageAsset, KanbanStatus } from '@/lib/types';
import { ImageCard } from './ImageCard';

const columns: { key: KanbanStatus; label: string }[] = [
  { key: 'to_tag', label: 'To Tag' },
  { key: 'tagged', label: 'Tagged' },
  { key: 'in_review', label: 'In Review' },
  { key: 'approved', label: 'Approved' }
];

export function KanbanBoard() {
  const [items, setItems] = useState<ImageAsset[]>([]);

  useEffect(() => {
    fetch('/api/assets').then((r) => r.json()).then((j) => setItems(j.items || []));
  }, []);

  const grouped = useMemo(
    () =>
      columns.reduce((acc, col) => {
        acc[col.key] = items.filter((item) => item.status === col.key);
        return acc;
      }, {} as Record<KanbanStatus, ImageAsset[]>),
    [items]
  );

  const addTagLocalFirst = (id: string, tag: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, tags: [...item.tags, tag] } : item)));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <section key={column.key} className="rounded-xl border border-border bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{column.label}</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{grouped[column.key]?.length || 0}</span>
          </div>
          <div className="space-y-3">
            {(grouped[column.key] || []).map((item) => (
              <ImageCard key={item.id} item={item} onAddTag={addTagLocalFirst} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
