import { BLOG_ARTICLES } from '@/lib/data/blog/articles'

export function getBlogArticle(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug)
}

export function getOtherArticles(slug: string) {
  return BLOG_ARTICLES.filter((article) => article.slug !== slug)
}
