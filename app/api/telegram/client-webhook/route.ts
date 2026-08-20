import { NextResponse, after } from 'next/server'
import { parseCommand } from '@/lib/telegram/telegram-commands'
import {
  linkTelegramChat,
  getLatestRequestStatusByChatId,
} from '@/lib/repositories/requests'
import { requestStatusLabels } from '@/lib/data/request-statuses/constants'
import {
  notifyClient,
  formatLinkedMessage,
  formatInvalidLinkMessage,
  formatNotLinkedMessage,
  formatHelpMessage,
} from '@/lib/telegram/telegram'

async function handleMessage(chatId: string, text: string): Promise<void> {
  const { command, payload } = parseCommand(text)

  if (command === '/start' && payload) {
    const linked = await linkTelegramChat(payload, chatId)
    await notifyClient(
      chatId,
      linked
        ? formatLinkedMessage({
            name: linked.name,
            phone: linked.phone,
            comment: linked.comment,
            statusMessage: requestStatusLabels[linked.status],
          })
        : formatInvalidLinkMessage(),
    )
    return
  }

  if (command === '/status') {
    const latest = await getLatestRequestStatusByChatId(chatId)
    await notifyClient(
      chatId,
      latest ? requestStatusLabels[latest.status] : formatNotLinkedMessage(),
    )
    return
  }

  await notifyClient(chatId, formatHelpMessage())
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token')

  if (secret !== process.env.TELEGRAM_CLIENT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const update = await req.json()
  const chatId = update?.message?.chat?.id
  const text = update?.message?.text

  if (!chatId || typeof text !== 'string') {
    return NextResponse.json({ ok: true })
  }

  // Telegram expects a fast 200; the actual reply is sent after the
  // response is flushed, same pattern as the admin notifications.
  after(() => handleMessage(String(chatId), text))

  return NextResponse.json({ ok: true })
}
