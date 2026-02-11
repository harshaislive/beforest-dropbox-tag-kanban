import { NextResponse } from 'next/server';

/**
 * Placeholder endpoint.
 * Expected future behavior:
 * 1) Receive tagged image metadata payload.
 * 2) Write tags/status back to Dropbox metadata or sidecar JSON.
 * 3) Store sync timestamp in Supabase.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: 'Dropbox writeback not implemented yet.',
      needed: ['DROPBOX_REFRESH_TOKEN', 'DROPBOX_TARGET_MODE(metadata|sidecar)']
    },
    { status: 501 }
  );
}
