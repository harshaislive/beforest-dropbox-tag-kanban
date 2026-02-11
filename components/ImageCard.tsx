'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageAsset, KanbanStatus } from '@/lib/types';

interface Props {
  item: ImageAsset;
  imageFit?: 'cover' | 'contain';
  onAddTag?: (id: string, tag: string) => void;
  onChangeStatus?: (id: string, status: KanbanStatus) => void;
}

const statusOptions: { value: KanbanStatus; label: string }[] = [
  { value: 'to_tag', label: 'To Tag' },
  { value: 'tagged', label: 'Tagged' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' }
];

export function ImageCard({ item, imageFit = 'contain', onAddTag, onChangeStatus }: Props) {
  const [imageError, setImageError] = useState(false);
  const hasPreview = !!item.preview_url && !imageError;

  return (
    <div className="rounded-lg border border-black/10 bg-white p-2.5 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-black/20 hover:bg-[#fafaf9]">
      <div className="relative mb-2 h-48 w-full overflow-hidden rounded-md border border-black/5 bg-[#f3f3f1]">
        {hasPreview ? (
          <Image
            src={item.preview_url}
            alt={item.dropbox_path}
            fill
            className={imageFit === 'contain' ? 'object-contain' : 'object-cover'}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#7a7a7a]">Preview unavailable</div>
        )}
      </div>
      <p className="mb-2 truncate text-[11px] text-[#7a7a7a]" title={item.dropbox_path}>
        {item.dropbox_path}
      </p>
      <div className="mb-2 flex min-h-6 flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-md border border-black/10 bg-[#f7f7f5] px-1.5 py-0.5 text-[11px] text-[#525252]">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mb-2">
        {item.preview_url && (
          <a href={item.preview_url} target="_blank" rel="noreferrer" className="text-[11px] font-medium text-[#3f3f3f] underline">
            Open full image
          </a>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        {onAddTag && (
          <button
            className="rounded-md border border-black/10 bg-white px-2 py-1 text-[11px] font-medium text-[#3f3f3f] transition hover:bg-[#f3f3f1]"
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
            className="rounded-md border border-black/10 bg-white px-2 py-1 text-[11px] text-[#3f3f3f]"
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
