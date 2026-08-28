import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { ArticleHeader } from '@/components/blog/article-header'
import { ArticleBody } from '@/components/blog/article-body'
import { RelatedArticles } from '@/components/blog/related-articles'
import { CtaSection } from '@/components/common'
import { CtaLink } from '@/components/ui'
import { BLOG_ARTICLES } from '@/lib/data/blog/articles'
import { getBlogArticle, getOtherArticles } from '@/lib/utils/blog-utils'
import { getArticleJsonLd, getBreadcrumbJsonLd } from '@/lib/seo/json-ld'
import { SITE } from '@/lib/data/site/constants'

export function generateStaticParams() {
  return BLOG_ARTICLES.map(({ slug }) => ({ slug }))
}

export const dynamicParams = false

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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: article.metaTitle,
      description: article.metaDescription,
      images: [SITE.ogImagePath],
      locale: SITE.locale,
    },
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

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Головна', path: '/' },
    { name: 'Блог', path: '/blog' },
    { name: article.title, path: `/blog/${slug}` },
  ])

  return (
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getArticleJsonLd(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleHeader
        category={article.category}
        readingTime={article.readingTime}
        title={article.title}
        lead={article.lead}
      />
      <ArticleBody blocks={article.body} />
      <CtaSection>
        <CtaLink href={article.ctaPrimary.href}>
          {article.ctaPrimary.label}
        </CtaLink>
        <CtaLink href={article.ctaSecondary.href} variant="ghost">
          {article.ctaSecondary.label}
        </CtaLink>
      </CtaSection>
      <RelatedArticles articles={getOtherArticles(slug)} />
    </PageContainer>
  )
}
