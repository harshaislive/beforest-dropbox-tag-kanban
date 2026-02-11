export type KanbanStatus = 'to_tag' | 'tagged' | 'in_review' | 'approved';

export interface ImageAsset {
  id: string;
  dropbox_path: string;
  preview_url: string;
  status: KanbanStatus;
  tags: string[];
  assigned_to?: string | null;
  created_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  tagged_count: number;
}
