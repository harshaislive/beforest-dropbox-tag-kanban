import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { KanbanStatus } from '@/lib/types';

const allowedStatuses: KanbanStatus[] = ['to_tag', 'tagged', 'in_review', 'approved'];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const nextStatus = String(body.status ?? '') as KanbanStatus;

  if (!allowedStatuses.includes(nextStatus)) {
    return NextResponse.json({ ok: false, message: 'Invalid status.' }, { status: 400 });
  }

  const asset = await prisma.imageAsset.findUnique({ where: { id: params.id } });
  if (!asset) {
    return NextResponse.json({ ok: false, message: 'Image asset not found.' }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.imageAsset.update({
      where: { id: params.id },
      data: { status: nextStatus }
    });

    await tx.tagEvent.create({
      data: {
        imageId: params.id,
        actorId: session.user.id,
        eventType: 'move_status',
        payload: {
          from_status: asset.status,
          to_status: nextStatus
        }
      }
    });
  });

  return NextResponse.json({ ok: true });
}
