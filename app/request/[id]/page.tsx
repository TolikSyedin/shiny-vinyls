import { notFound } from 'next/navigation'
import { getRequestStatus } from '@/lib/repositories/requests'
import { requestStatusLabels } from '@/lib/request-status-labels'
import { PageContainer } from '@/components/layout'
import { PageHeader } from '@/components/common'
import { Mono } from '@/components/ui'

export const metadata = {
  title: 'Статус заявки — Shiny Vinyls',
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
        eyebrow="Заявка"
        title="Ваша заявка"
        lead={requestStatusLabels[result.status]}
      >
        <Mono>
          Створено: {new Date(result.created_at).toLocaleString('uk-UA')}
        </Mono>
      </PageHeader>
      {botUsername && (
        <a
          href={`https://t.me/${botUsername}?start=${result.id}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          Слідкувати за статусом заявки в Telegram
        </a>
      )}
    </PageContainer>
  )
}
