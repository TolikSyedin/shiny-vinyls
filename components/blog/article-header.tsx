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
    <header className="flex flex-col items-start gap-[1.25rem] pt-[clamp(2.5rem,6vw,4.5rem)]">
      <div className="flex flex-wrap items-center gap-[0.5rem]">
        <Breadcrumbs items={[{ label: 'Блог', href: '/blog' }, { label: category }]} />
        <Eyebrow>{readingTime}</Eyebrow>
      </div>
      <h1>{title}</h1>
      <Lead>{lead}</Lead>
    </header>
  )
}
