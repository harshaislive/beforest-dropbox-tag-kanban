import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getDropboxConfigFromEnv, getDropboxTemporaryLink, refreshDropboxAccessToken } from '@/lib/dropbox';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;
const STALE_AFTER_MS = 1000 * 60 * 60 * 3;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { limit?: number; all?: boolean };
  const requestedLimit = Math.floor(body.limit ?? DEFAULT_LIMIT);
  const limit = Math.max(1, Math.min(requestedLimit, MAX_LIMIT));
  const refreshAll = body.all === true;

  let accessToken: string;
  try {
    const config = getDropboxConfigFromEnv();
    accessToken = await refreshDropboxAccessToken(config);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Dropbox setup error'
      },
      { status: 500 }
    );
  }

  const staleBefore = new Date(Date.now() - STALE_AFTER_MS);

  const assets = await prisma.imageAsset.findMany({
    where: refreshAll
      ? undefined
      : {
          OR: [{ previewRefreshedAt: null }, { previewRefreshedAt: { lt: staleBefore } }]
        },
    orderBy: [{ previewRefreshedAt: 'asc' }, { updatedAt: 'asc' }],
    take: limit,
    select: {
      id: true,
      dropboxPath: true
    }
  });

  let refreshed = 0;
  let errors = 0;

  for (const asset of assets) {
    try {
      const previewUrl = await getDropboxTemporaryLink(accessToken, asset.dropboxPath);
      await prisma.imageAsset.update({
        where: { id: asset.id },
        data: {
          previewUrl,
          previewRefreshedAt: new Date()
        }
      });
      refreshed += 1;
    } catch {
      errors += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    counts: {
      considered: assets.length,
      refreshed,
      errors
    }
  });
}
