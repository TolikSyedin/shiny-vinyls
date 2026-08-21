import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { ArticleHeader } from '@/components/blog/article-header'
import { ArticleBody } from '@/components/blog/article-body'
import { RelatedArticles } from '@/components/blog/related-articles'
import { CtaLink, Row } from '@/components/ui'
import { BLOG_ARTICLES } from '@/lib/data/blog/articles'
import { getBlogArticle, getOtherArticles } from '@/lib/utils/blog-utils'

export function generateStaticParams() {
  return BLOG_ARTICLES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getBlogArticle(slug)

  if (!article) {
    return {}
  }

  return {
    title: `${article.metaTitle} — Shiny Vinyls`,
    description: article.metaDescription,
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getBlogArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <PageContainer>
      <ArticleHeader
        category={article.category}
        readingTime={article.readingTime}
        title={article.title}
        lead={article.lead}
      />
      <ArticleBody blocks={article.body} />
      <Row className="mt-[2rem]">
        <CtaLink href={article.ctaPrimary.href}>
          {article.ctaPrimary.label}
        </CtaLink>
        <CtaLink href={article.ctaSecondary.href} variant="ghost">
          {article.ctaSecondary.label}
        </CtaLink>
      </Row>
      <RelatedArticles articles={getOtherArticles(slug)} />
    </PageContainer>
  )
}
