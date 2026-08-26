import { Section, SectionHeading } from '@/components/common'
import { Card, Mono, Note } from '@/components/ui'
import type { BlogArticle } from '@/lib/data/blog/articles'

export function RelatedArticles({ articles }: { articles: BlogArticle[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Читати далі">Ще дві статті</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map(({ slug, category, shortTitle, relatedNote }) => (
          <Card key={slug} href={`/blog/${slug}`}>
            <Mono tone="stamp">{category}</Mono>
            <h3>{shortTitle}</h3>
            <Note>{relatedNote}</Note>
          </Card>
        ))}
      </div>
    </Section>
  )
}
