import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();
  const name = body?.name?.toString().trim() || null;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ ok: false, message: 'Invalid signup payload.' }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, message: 'Email already registered.' }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash, name } });

  return NextResponse.json({ ok: true });
}
