'use client';

import Image from 'next/image';
import { ImageAsset } from '@/lib/types';

interface Props {
  item: ImageAsset;
  onAddTag?: (id: string, tag: string) => void;
}

export function ImageCard({ item, onAddTag }: Props) {
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
    </div>
  );
}
