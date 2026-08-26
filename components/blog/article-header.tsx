import { Breadcrumbs } from '@/components/common'
import { Eyebrow } from '@/components/ui'
import type { BlogArticle } from '@/lib/data/blog/articles'

export function ArticleHeader({
  category,
  readingTime,
  title,
  lead,
}: Pick<BlogArticle, 'category' | 'readingTime' | 'title' | 'lead'>) {
  return (
    <header className="flex flex-col items-start gap-4 pt-8">
      <div className="flex flex-wrap items-center gap-2">
        <Breadcrumbs
          items={[{ label: 'Блог', href: '/blog' }, { label: category }]}
        />
        <Eyebrow>{readingTime}</Eyebrow>
      </div>
      <h1>{title}</h1>
      <p>{lead}</p>
    </header>
  )
}
