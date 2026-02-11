'use client';

import { useMemo, useState } from 'react';
import { ImageAsset, KanbanStatus } from '@/lib/types';
import { ImageCard } from './ImageCard';

const columns: { key: KanbanStatus; label: string }[] = [
  { key: 'to_tag', label: 'To Tag' },
  { key: 'tagged', label: 'Tagged' },
  { key: 'in_review', label: 'In Review' },
  { key: 'approved', label: 'Approved' }
];

const demoData: ImageAsset[] = [
  {
    id: '1',
    dropbox_path: '/incoming/cat-1.jpg',
    preview_url: 'https://picsum.photos/400/300?1',
    status: 'to_tag',
    tags: ['cat', 'indoor']
  },
  {
    id: '2',
    dropbox_path: '/incoming/bird-2.jpg',
    preview_url: 'https://picsum.photos/400/300?2',
    status: 'tagged',
    tags: ['bird']
  }
];

export function KanbanBoard() {
  const [items, setItems] = useState<ImageAsset[]>(demoData);

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
    // TODO: sync with Supabase image_tags table + optional Dropbox metadata writeback.
  };

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
              <ImageCard key={item.id} item={item} onAddTag={addTagLocalFirst} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
