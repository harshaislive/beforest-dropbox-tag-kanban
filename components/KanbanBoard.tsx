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
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    setLoading(true);
    const res = await fetch('/api/board', { cache: 'no-store' });
    const json = (await res.json()) as { ok: boolean; data?: ImageAsset[] };
    setItems(json.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const grouped = useMemo(
    () =>
      columns.reduce((acc, col) => {
        acc[col.key] = items.filter((item) => item.status === col.key);
        return acc;
      }, {} as Record<KanbanStatus, ImageAsset[]>),
    [items]
  );

  const addTag = async (id: string, tag: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, tags: [...new Set([...item.tags, tag.toLowerCase()])] } : item)));

    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageAssetId: id, tag })
    });

    if (!res.ok) {
      await fetchBoard();
    }

    // Dropbox writeback placeholder remains intentionally unimplemented:
    // await fetch('/api/dropbox/writeback', { method: 'POST', body: JSON.stringify({ imageAssetId: id }) })
  };

  const changeStatus = async (id: string, status: KanbanStatus) => {
    const previous = items;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    const res = await fetch(`/api/assets/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      setItems(previous);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading board...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <section key={column.key} className="rounded-xl border border-border bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{column.label}</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{grouped[column.key].length}</span>
          </div>
          <div className="space-y-3">
            {grouped[column.key].map((item) => (
              <ImageCard key={item.id} item={item} onAddTag={addTag} onChangeStatus={changeStatus} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
