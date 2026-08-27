import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/data/site/constants'
import { BLOG_ARTICLES } from '@/lib/data/blog/articles'

const STATIC_PATHS = [
  '/',
  '/how-it-works',
  '/contacts',
  '/reviews',
  '/request',
  '/blog',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
  }))

  const blogEntries = BLOG_ARTICLES.map(({ slug }) => ({
    url: `${SITE.url}/blog/${slug}`,
  }))

  return [...staticEntries, ...blogEntries]
}
