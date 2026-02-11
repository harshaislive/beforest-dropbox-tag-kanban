'use client';

import Image from 'next/image';
import { ImageAsset, KanbanStatus } from '@/lib/types';

interface Props {
  item: ImageAsset;
  onAddTag?: (id: string, tag: string) => void;
  onChangeStatus?: (id: string, status: KanbanStatus) => void;
}

const statusOptions: { value: KanbanStatus; label: string }[] = [
  { value: 'to_tag', label: 'To Tag' },
  { value: 'tagged', label: 'Tagged' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' }
];

export function ImageCard({ item, onAddTag, onChangeStatus }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="relative mb-3 h-36 w-full overflow-hidden rounded-lg bg-slate-100">
        <Image src={item.preview_url} alt={item.dropbox_path} fill className="object-cover" />
      </div>
      <p className="mb-2 truncate text-xs text-slate-500">{item.dropbox_path}</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        {onAddTag && (
          <button
            className="text-xs font-medium text-slate-700 underline"
            onClick={() => {
              const tag = window.prompt('Add tag');
              if (tag) onAddTag(item.id, tag);
            }}
          >
            + Add tag
          </button>
        )}
        {onChangeStatus && (
          <select
            className="rounded border border-border bg-white px-2 py-1 text-xs"
            value={item.status}
            onChange={(e) => onChangeStatus(item.id, e.target.value as KanbanStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
