import Link from 'next/link'
import { PageContainer } from '@/components/layout'
import { ColumnContentSection, PageHeader } from '@/components/common'
import { Note } from '@/components/ui'
import { BLOG_ARTICLES } from '@/lib/data/blog/articles'

export const metadata = {
  title: 'Блог — Shiny Vinyls',
  description:
    'Практичні тексти про догляд за вінілом: як почистити платівку вдома, чим ультразвук відрізняється від вакуумної мийки і звідки береться тріск.',
}

export default function BlogPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Блог"
        title="Догляд за вінілом без міфів"
        lead="Ми пишемо те, що самі перевіряли на чужих платівках. Включно з методами, які працюють без нас — і з тими, які краще не пробувати ніколи."
      >
        <Note>
          Три тексти, які покривають майже все, що питають перед замовленням:
          чим ультразвук відрізняється від вакуумної мийки, як помити
          платівку самому, і звідки береться тріск.
        </Note>
      </PageHeader>

      <ColumnContentSection
        eyebrow="Читати"
        heading="Три тексти"
        items={BLOG_ARTICLES.map(({ slug, category, readingTime, title, indexNote }) => ({
          href: `/blog/${slug}`,
          kicker: category,
          meta: readingTime,
          title,
          body: indexNote,
        }))}
      />

      <Note className="mt-[2rem]">
        Далі в планах: чи варто чистити нові платівки з магазину, і як
        зберігати колекцію в квартирі. Якщо є питання, на яке немає
        нормальної відповіді українською —{' '}
        <Link href="/contacts">напишіть нам</Link>
      </Note>
    </PageContainer>
  )
}
