import { PageContainer } from '@/components/layout'
import { CtaSection, PageHeader } from '@/components/common'
import { CtaLink } from '@/components/ui'

export const metadata = {
  title: 'Сторінку не знайдено — Shiny Vinyls',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Помилка 404"
        title="Голка зіскочила з доріжки"
        lead="Такої сторінки в нас немає — можливо, посилання застаріло або в адресі закралася помилка. Перевірте написання чи поверніться на головну, звідти точно знайдете дорогу."
      />
      <CtaSection>
        <CtaLink href="/">На головну</CtaLink>
        <CtaLink href="/blog" variant="ghost">
          До блогу
        </CtaLink>
      </CtaSection>
    </PageContainer>
  )
}
