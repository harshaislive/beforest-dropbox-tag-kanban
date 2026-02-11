import { NextResponse } from 'next/server';

/**
 * Placeholder endpoint.
 * Expected future behavior:
 * 1) Pull image list from configured Dropbox folder.
 * 2) Upsert into PostgreSQL image_assets via Prisma.
 * 3) Return ingest summary.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: 'Dropbox ingest not implemented yet.',
      needed: ['DROPBOX_APP_KEY', 'DROPBOX_APP_SECRET', 'DROPBOX_REFRESH_TOKEN', 'DROPBOX_SOURCE_FOLDER']
    },
    { status: 501 }
  );
}
