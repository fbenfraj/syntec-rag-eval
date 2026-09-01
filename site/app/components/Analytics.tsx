import Script from 'next/script'

/**
 * Cloudflare Web Analytics beacon.
 *
 * Chosen over Umami Cloud because the three FrajTech surfaces sit on three different hosts
 * (Vercel, Netlify, and the portfolio's own) and Umami's free tier covers exactly one site.
 * Cloudflare's is free on every plan, unlimited sites, and works without putting any domain
 * behind Cloudflare's proxy or changing DNS. It sets no cookie, so no consent banner.
 *
 * This measures ARRIVALS only. Whether a visitor actually ran a demo question is answered by
 * `demo_usage` in Postgres, written server-side in `app/api/ask/route.ts`, and that is the
 * authoritative count: this audience is engineers, and a meaningful share of them block
 * third-party beacons. Never reconcile the two by trusting this one.
 *
 * NOTE for whoever configures the dashboard: Cloudflare offers "Enable, excluding visitor
 * data in the EU". This site's audience is French. Turning that on measures nothing.
 */
export function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN
  if (token === undefined || token.length === 0) return null

  return (
    <Script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
      strategy="afterInteractive"
    />
  )
}
