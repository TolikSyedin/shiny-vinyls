import { PageContainer } from '@/components/layout'
import { PageHeader, Section } from '@/components/common'
import { CtaLink, Row } from '@/components/ui'

export const metadata = {
  title: 'Сторінку не знайдено — Shiny Vinyls',
}

export default function NotFound() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Помилка 404"
        title="Голка зіскочила з доріжки"
        lead="Такої сторінки в нас немає — можливо, посилання застаріло або в адресі закралася помилка. Перевірте написання чи поверніться на головну, звідти точно знайдете дорогу."
      />
      <Section>
        <Row>
          <CtaLink href="/">На головну</CtaLink>
          <CtaLink href="/blog" variant="ghost">
            До блогу
          </CtaLink>
        </Row>
      </Section>
    </PageContainer>
  )
}
