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
  const [busyAction, setBusyAction] = useState<'sync' | 'refresh' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('contain');

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

  const syncDropbox = async () => {
    setBusyAction('sync');
    setMessage('');

    try {
      const res = await fetch('/api/dropbox/ingest', { method: 'POST' });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        counts?: { scanned: number; new: number; updated: number; skipped: number; errors: number };
      };

      if (!res.ok || !json.ok || !json.counts) {
        setMessage(`Sync failed: ${json.message ?? 'unknown error'}`);
        return;
      }

      const c = json.counts;
      setMessage(`Sync complete — scanned:${c.scanned} new:${c.new} updated:${c.updated} skipped:${c.skipped} errors:${c.errors}`);
      await fetchBoard();
    } catch {
      setMessage('Sync failed due to network/server error');
    } finally {
      setBusyAction(null);
    }
  };

  const refreshLinks = async () => {
    setBusyAction('refresh');
    setMessage('');

    try {
      const res = await fetch('/api/dropbox/refresh-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 })
      });
      const json = (await res.json()) as {
        ok: boolean;
        message?: string;
        counts?: { considered: number; refreshed: number; errors: number };
      };

      if (!res.ok || !json.ok || !json.counts) {
        setMessage(`Refresh failed: ${json.message ?? 'unknown error'}`);
        return;
      }

      const c = json.counts;
      setMessage(`Links refreshed — considered:${c.considered} refreshed:${c.refreshed} errors:${c.errors}`);
      await fetchBoard();
    } catch {
      setMessage('Refresh failed due to network/server error');
    } finally {
      setBusyAction(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading board...</p>;
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          className="rounded-md border border-black/10 bg-[#191919] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          onClick={syncDropbox}
          disabled={busyAction !== null}
        >
          {busyAction === 'sync' ? 'Syncing…' : 'Sync Dropbox'}
        </button>
        <button
          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#303030] transition hover:bg-[#f7f7f5] disabled:opacity-60"
          onClick={refreshLinks}
          disabled={busyAction !== null}
        >
          {busyAction === 'refresh' ? 'Refreshing…' : 'Refresh Links'}
        </button>
        <button
          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#303030] transition hover:bg-[#f7f7f5]"
          onClick={() => setImageFit((prev) => (prev === 'contain' ? 'cover' : 'contain'))}
        >
          Fit: {imageFit}
        </button>
        {message && <p className="text-xs text-[#6b6b6b]">{message}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {columns.map((column) => (
          <section key={column.key} className="rounded-lg border border-black/10 bg-[#fcfcfb] p-3">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#242424]">{column.label}</h2>
              <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-xs text-[#6b6b6b]">{grouped[column.key].length}</span>
            </div>
            <div className="space-y-3">
              {grouped[column.key].map((item) => (
                <ImageCard key={item.id} item={item} imageFit={imageFit} onAddTag={addTag} onChangeStatus={changeStatus} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
