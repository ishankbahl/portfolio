import type { MetadataRoute } from 'next'

// Required under output: 'export'. Without it the build fails collecting page
// data for /robots.txt, because Next will not assume a metadata route is static.
export const dynamic = 'force-static'

// No sitemap entry. There is one url, and a sitemap listing it tells a crawler
// nothing it did not already have.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
  }
}
