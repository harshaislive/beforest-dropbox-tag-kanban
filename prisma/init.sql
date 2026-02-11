-- Optional bootstrap data for local dev.
-- Run AFTER migration if you want sample image assets.

INSERT INTO image_assets (id, dropbox_path, preview_url, status, created_at, updated_at)
VALUES
  ('cmasset001', '/incoming/cat-1.jpg', 'https://picsum.photos/400/300?1', 'to_tag', NOW(), NOW()),
  ('cmasset002', '/incoming/bird-2.jpg', 'https://picsum.photos/400/300?2', 'tagged', NOW(), NOW())
ON CONFLICT (dropbox_path) DO NOTHING;
