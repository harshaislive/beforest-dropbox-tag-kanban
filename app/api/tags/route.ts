import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const imageAssetId = String(body.imageAssetId ?? '').trim();
  const tag = String(body.tag ?? '').trim().toLowerCase();

  if (!imageAssetId || !tag) {
    return NextResponse.json({ ok: false, message: 'imageAssetId and tag are required.' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.imageTag.upsert({
        where: { imageAssetId_tag: { imageAssetId, tag } },
        update: {},
        create: {
          imageAssetId,
          tag,
          createdBy: session.user.id
        }
      });

      const asset = await tx.imageAsset.findUnique({ where: { id: imageAssetId } });
      if (!asset) throw new Error('Asset not found');

      if (asset.status === 'to_tag') {
        await tx.imageAsset.update({ where: { id: imageAssetId }, data: { status: 'tagged' } });
      }

      await tx.tagEvent.create({
        data: {
          imageAssetId,
          userId: session.user.id,
          eventType: 'tag_added',
          tag,
          fromStatus: asset.status,
          toStatus: asset.status === 'to_tag' ? 'tagged' : asset.status
        }
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Asset not found') {
      return NextResponse.json({ ok: false, message: 'Image asset not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: false, message: 'Could not add tag.' }, { status: 500 });
  }
}
