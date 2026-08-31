/**
 * Not a static export: the report pages prerender, but the project also hosts the demo's
 * API route, which needs a server. Vercel prerenders the static pages anyway.
 */
export default {
  images: { unoptimized: true },
}
