import { NextResponse } from 'next/server';
import { processScheduledBroadcasts } from '@/lib/broadcasts/engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes if on Vercel

/**
 * Cron endpoint for sending scheduled broadcasts.
 * Triggered by `instrumentation.ts` every 60s.
 */
export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.AUTOMATION_CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processScheduledBroadcasts();
    return NextResponse.json(result);
  } catch (err) {
    console.error('[broadcast-cron] Error processing scheduled broadcasts:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
