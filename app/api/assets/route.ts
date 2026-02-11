import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const assets = await prisma.imageAsset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: { orderBy: { createdAt: 'desc' } } },
    take: 200
  });

  const data = assets.map((a) => ({
    id: a.id,
    dropbox_path: a.dropboxPath,
    preview_url: a.previewUrl ?? 'https://picsum.photos/400/300?seed=' + a.id,
    status: a.status,
    tags: a.tags.map((t) => t.tag)
  }));

  return NextResponse.json({ items: data });
}
