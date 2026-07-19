'use server';

import { processScheduledBroadcasts } from '@/lib/broadcasts/engine';

export async function triggerBroadcastsAction() {
  // Fire and forget the background worker so it starts immediately
  // instead of waiting up to 60s for the next cron tick.
  processScheduledBroadcasts().catch((err) => {
    console.error('[broadcast-trigger] Background error:', err);
  });
}
