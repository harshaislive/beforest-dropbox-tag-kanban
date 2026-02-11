import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const leaders = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          imageTags: true
        }
      }
    },
    orderBy: {
      imageTags: {
        _count: 'desc'
      }
    },
    take: 10
  });

  return NextResponse.json({
    ok: true,
    data: leaders.map((user) => ({
      user_id: user.id,
      display_name: user.name ?? user.email,
      tagged_count: user._count.imageTags
    }))
  });
}
