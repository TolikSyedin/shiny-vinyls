import { notFound } from 'next/navigation'
import { getRequestStatus } from '@/lib/repositories/requests'
import { requestStatusLabels } from '@/lib/request-status-labels'

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
    <main className="mx-auto flex max-w-md flex-1 flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Ваша заявка</h1>
      <p>{requestStatusLabels[result.status]}</p>
      <p className="text-sm text-muted-foreground">
        Створено: {new Date(result.created_at).toLocaleString('uk-UA')}
      </p>
      {botUsername && (
        <a
          href={`https://t.me/${botUsername}?start=${result.id}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          Слідкувати за статусом заявки в Telegram
        </a>
      )}
    </main>
  )
}
