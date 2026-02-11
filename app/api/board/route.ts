import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const assets = await prisma.imageAsset.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      imageTags: {
        orderBy: { createdAt: 'asc' },
        select: { tag: true }
      }
    }
  });

  return NextResponse.json({
    ok: true,
    data: assets.map((asset) => ({
      id: asset.id,
      dropbox_path: asset.dropboxPath,
      preview_url: asset.previewUrl,
      status: asset.status,
      assigned_to: asset.assignedTo,
      created_at: asset.createdAt.toISOString(),
      tags: asset.imageTags.map((t) => t.tag)
    }))
  });
}
