/**
 * Next.js Instrumentation — runs once on server startup.
 *
 * Starts a background `setInterval` that pings the automation and
 * flow cron endpoints every 60 seconds. This replaces the need for
 * an external cron service (Vercel Cron, cron-job.org, etc.) on
 * self-hosted platforms like Coolify where no built-in scheduler
 * exists.
 *
 * The interval is only started outside the Edge runtime and only
 * when `AUTOMATION_CRON_SECRET` is configured, so it's a no-op in
 * dev if the env var is unset.
 */

export async function register() {
  // Skip on Edge — it doesn't support long-lived intervals.
  // In Next.js 16 the env var may be undefined in the Node process,
  // so we check for 'edge' specifically instead of requiring 'nodejs'.
  if (process.env.NEXT_RUNTIME === 'edge') return

  const secret = process.env.AUTOMATION_CRON_SECRET
  if (!secret) {
    console.warn('[cron-pinger] AUTOMATION_CRON_SECRET not set — skipping self-ping')
    return
  }

  // Derive the base URL from PORT (Coolify injects this), falling
  // back to 3000.  We always hit localhost — the cron endpoints are
  // server-side only, never exposed through an external proxy.
  const port = process.env.PORT || '3000'
  const base = `http://localhost:${port}`

  const INTERVAL_MS = 60_000 // 1 minute

  const endpoints = [
    `${base}/api/automations/cron`,
    `${base}/api/flows/cron`,
    `${base}/api/whatsapp/broadcast/retry`,
  ]

  async function tick() {
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: { 'x-cron-secret': secret! },
        })
        const body = await res.json().catch(() => ({}))

        // Log non-200 responses so auth/config problems are visible.
        if (!res.ok) {
          console.error(`[cron-pinger] ${url} → ${res.status}`, body)
          continue
        }

        const processed = body.processed ?? body.swept ?? 0
        if (processed > 0) {
          console.log(`[cron-pinger] ${url} → ${JSON.stringify(body)}`)
        }
      } catch (err) {
        console.error(`[cron-pinger] ${url} failed:`, err)
      }
    }
  }

  // Delay the first tick slightly so the server is fully ready to
  // handle requests before we start pinging ourselves.
  setTimeout(() => {
    console.log('[cron-pinger] started — pinging every 60s')
    // Run immediately on startup (picks up any pending rows from
    // before the last deploy / restart).
    void tick()
    setInterval(() => void tick(), INTERVAL_MS)
  }, 5_000)
}
