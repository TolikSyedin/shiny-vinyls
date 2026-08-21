import Link from 'next/link'
import { Section, SectionHeading } from '@/components/common'
import { Mono, Note } from '@/components/ui'
import type { BlogArticle } from '@/lib/data/blog/articles'

export function RelatedArticles({ articles }: { articles: BlogArticle[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Читати далі">Ще дві статті</SectionHeading>
      <div className="mt-[1.25rem] grid gap-[clamp(0.75rem,2vw,1.5rem)] sm:grid-cols-2">
        {articles.map(({ slug, category, shortTitle, relatedNote }) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="flex flex-col gap-[0.6rem] rounded-[0.3rem] border border-[var(--rule)] bg-[var(--surface-2)] p-[clamp(1rem,2.5vw,1.5rem)] text-[var(--ink)]"
          >
            <Mono tone="stamp">{category}</Mono>
            <h3>{shortTitle}</h3>
            <Note>{relatedNote}</Note>
          </Link>
        ))}
      </div>
    </Section>
  )
}
