import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: { select: { imageTags: true } }
    },
    orderBy: { imageTags: { _count: 'desc' } },
    take: 20
  });

  return NextResponse.json({
    rows: rows.map((r) => ({
      user_id: r.id,
      display_name: r.name || r.email,
      tagged_count: r._count.imageTags
    }))
  });
}
