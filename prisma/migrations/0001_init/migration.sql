-- CreateEnum
CREATE TYPE "KanbanStatus" AS ENUM ('to_tag', 'tagged', 'in_review', 'approved');

-- users
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

-- sessions
CREATE TABLE "sessions" (
  "id" TEXT PRIMARY KEY,
  "session_token" TEXT NOT NULL UNIQUE,
  "user_id" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- image_assets
CREATE TABLE "image_assets" (
  "id" TEXT PRIMARY KEY,
  "dropbox_path" TEXT NOT NULL UNIQUE,
  "preview_url" TEXT NOT NULL,
  "status" "KanbanStatus" NOT NULL DEFAULT 'to_tag',
  "assigned_to" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "image_assets_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "image_assets_status_idx" ON "image_assets"("status");
CREATE INDEX "image_assets_assigned_to_idx" ON "image_assets"("assigned_to");

-- image_tags
CREATE TABLE "image_tags" (
  "id" TEXT PRIMARY KEY,
  "image_asset_id" TEXT NOT NULL,
  "tag" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "image_tags_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "image_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "image_tags_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "image_tags_image_asset_id_tag_key" ON "image_tags"("image_asset_id", "tag");
CREATE INDEX "image_tags_created_by_idx" ON "image_tags"("created_by");

-- tag_events
CREATE TABLE "tag_events" (
  "id" TEXT PRIMARY KEY,
  "image_asset_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "from_status" "KanbanStatus",
  "to_status" "KanbanStatus",
  "tag" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tag_events_image_asset_id_fkey" FOREIGN KEY ("image_asset_id") REFERENCES "image_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "tag_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "tag_events_image_asset_id_created_at_idx" ON "tag_events"("image_asset_id", "created_at");
CREATE INDEX "tag_events_user_id_created_at_idx" ON "tag_events"("user_id", "created_at");

-- nextauth compatibility tables
CREATE TABLE "accounts" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

CREATE TABLE "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
