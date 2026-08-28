import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/data/site/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/request/'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
