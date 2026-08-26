import { notFound } from 'next/navigation'
import { getRequestStatus } from '@/lib/repositories/requests'
import { requestStatusLabels } from '@/lib/data/request-statuses/constants'
import { PageContainer } from '@/components/layout'
import { PageHeader, Section } from '@/components/common'
import { CtaLink, Mono, Row } from '@/components/ui'

export const metadata = {
  title: 'Статус замовлення — Shiny Vinyls',
}

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getRequestStatus(id)

  if (!result) {
    notFound()
  }

  const botUsername = process.env.TELEGRAM_CLIENT_BOT_USERNAME

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Замовлення"
        title="Ваше замовлення"
        lead={requestStatusLabels[result.status]}
      >
        <Mono>
          Створено: {new Date(result.created_at).toLocaleString('uk-UA')}
        </Mono>
      </PageHeader>
      {botUsername && (
        <Section>
          <Row>
            <CtaLink
              href={`https://t.me/${botUsername}?start=${result.id}`}
              variant="ghost"
            >
              Слідкувати за статусом замовлення в Telegram
            </CtaLink>
          </Row>
        </Section>
      )}
    </PageContainer>
  )
}
