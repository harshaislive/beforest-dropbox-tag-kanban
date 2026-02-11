import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getDropboxConfigFromEnv, getDropboxTemporaryLink, listDropboxImageFiles, refreshDropboxAccessToken } from '@/lib/dropbox';

const LINK_REFRESH_AFTER_MS = 1000 * 60 * 60 * 3;

type IngestCounts = {
  scanned: number;
  new: number;
  updated: number;
  skipped: number;
  errors: number;
};

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  let accessToken: string;
  let dropboxPaths: string[];

  try {
    const config = getDropboxConfigFromEnv();
    accessToken = await refreshDropboxAccessToken(config);
    dropboxPaths = await listDropboxImageFiles(accessToken, config.sourceFolder);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Dropbox setup error'
      },
      { status: 500 }
    );
  }

  const counts: IngestCounts = {
    scanned: dropboxPaths.length,
    new: 0,
    updated: 0,
    skipped: 0,
    errors: 0
  };

  const existingAssets = await prisma.imageAsset.findMany({
    where: { dropboxPath: { in: dropboxPaths } },
    select: { id: true, dropboxPath: true, previewUrl: true, previewRefreshedAt: true }
  });
  const existingByPath = new Map(existingAssets.map((asset) => [asset.dropboxPath, asset]));

  const now = new Date();

  for (const path of dropboxPaths) {
    const existing = existingByPath.get(path);
    const isNew = !existing;
    const linkStale =
      !existing?.previewRefreshedAt || now.getTime() - existing.previewRefreshedAt.getTime() > LINK_REFRESH_AFTER_MS;
    const shouldRefreshLink = isNew || !existing.previewUrl || linkStale;

    if (!shouldRefreshLink) {
      counts.skipped += 1;
      continue;
    }

    try {
      const previewUrl = await getDropboxTemporaryLink(accessToken, path);
      const previewRefreshedAt = new Date();

      if (isNew) {
        await prisma.imageAsset.create({
          data: {
            dropboxPath: path,
            previewUrl,
            previewRefreshedAt
          }
        });
        counts.new += 1;
      } else {
        await prisma.imageAsset.update({
          where: { id: existing.id },
          data: {
            previewUrl,
            previewRefreshedAt
          }
        });
        counts.updated += 1;
      }
    } catch {
      counts.errors += 1;
    }
  }

  return NextResponse.json({ ok: true, counts });
}
