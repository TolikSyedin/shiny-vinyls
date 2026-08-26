import { Breadcrumbs } from '@/components/common'
import { Eyebrow, Lead } from '@/components/ui'
import type { BlogArticle } from '@/lib/data/blog/articles'

export function ArticleHeader({
  category,
  readingTime,
  title,
  lead,
}: Pick<BlogArticle, 'category' | 'readingTime' | 'title' | 'lead'>) {
  return (
    <header className="flex flex-col items-start gap-4 pt-16">
      <div className="flex flex-wrap items-center gap-4">
        <Breadcrumbs
          items={[{ label: 'Блог', href: '/blog' }, { label: category }]}
        />
        <Eyebrow>{readingTime}</Eyebrow>
      </div>
      <h1>{title}</h1>
      <Lead>{lead}</Lead>
    </header>
  )
}
