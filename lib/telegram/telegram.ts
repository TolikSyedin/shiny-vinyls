import 'server-only'

type NewRequestNotification = {
  name: string
  phone: string
  comment?: string
  adminUrl: string
}

type NewReviewNotification = {
  name: string
  rating: number
  text: string
  adminUrl: string
}

type NewContactMessageNotification = {
  name: string
  contact: string
  message: string
}

// Telegram's parse_mode: 'HTML' requires escaping any user-supplied text
// interpolated into the message — an unescaped `<`/`&` (e.g. in a client's
// comment) would make sendMessage fail with "can't parse entities", which
// (per sendTelegramMessage's never-throw contract) silently drops the whole
// notification instead of just breaking formatting.
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatAdminLink(adminUrl: string, label: string): string {
  return `<a href="${escapeHtml(adminUrl)}">${escapeHtml(label)}</a>`
}

type LinkedRequestInfo = {
  name: string
  phone: string
  comment?: string | null
  statusMessage: string
}

// Echoes back the request's own fields so the client can visually confirm
// this is *their* замовлення before trusting the bot — same reasoning as why
// formatNewRequestMessage escapes its input: these are user-supplied values
// interpolated into an HTML-parsed message.
export function formatLinkedMessage(input: LinkedRequestInfo): string {
  const lines = [
    `Telegram привʼязано до замовлення:`,
    `Імʼя: ${escapeHtml(input.name)}`,
    `Телефон: ${escapeHtml(input.phone)}`,
  ]
  if (input.comment) lines.push(`Коментар: ${escapeHtml(input.comment)}`)
  lines.push('', input.statusMessage)
  return lines.join('\n')
}

export function formatInvalidLinkMessage(): string {
  return 'Не вдалося знайти замовлення за цим посиланням. Спробуйте перейти за посиланням ще раз зі сторінки статусу замовлення на сайті.'
}

export function formatNotLinkedMessage(): string {
  return 'До цього чату ще не привʼязано жодного замовлення. Перейдіть за посиланням "Слідкувати за статусом замовлення в Telegram" на сторінці статусу Вашого замовлення на сайті.'
}

export function formatHelpMessage(): string {
  return 'Доступні команди:\n/status — дізнатись статус Вашого замовлення'
}

export function formatNewRequestMessage(input: NewRequestNotification): string {
  const lines = [
    `Нове замовлення:`,
    `Імʼя: ${escapeHtml(input.name)}`,
    `Телефон: ${escapeHtml(input.phone)}`,
  ]
  if (input.comment) lines.push(`Коментар: ${escapeHtml(input.comment)}`)
  lines.push(formatAdminLink(input.adminUrl, 'Обробити замовлення'))
  return lines.join('\n')
}

export function formatNewReviewMessage(input: NewReviewNotification): string {
  return [
    `Новий відгук:`,
    `Імʼя: ${escapeHtml(input.name)}`,
    `Рейтинг: ${input.rating}/5`,
    `Текст: ${escapeHtml(input.text)}`,
    formatAdminLink(input.adminUrl, 'Обробити відгук'),
  ].join('\n')
}

export function formatNewContactMessage(
  input: NewContactMessageNotification,
): string {
  return [
    `Нове повідомлення з форми контактів:`,
    `Імʼя: ${escapeHtml(input.name)}`,
    `Контакт: ${escapeHtml(input.contact)}`,
    `Повідомлення: ${escapeHtml(input.message)}`,
  ].join('\n')
}

// Token-agnostic on purpose: shared by the admin bot (notifyAdmin) and the
// client bot (notifyClient) below — each passes its own bot token.
async function sendTelegramMessage(
  token: string | undefined,
  chatId: string,
  text: string,
): Promise<void> {
  if (!token) {
    console.error('Telegram notification skipped: bot token is not set')
    return
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        // Bounds worst-case latency of the after() background task — a hung
        // Telegram API call should never linger indefinitely.
        signal: AbortSignal.timeout(5000),
      },
    )

    if (!res.ok) {
      console.error('Telegram sendMessage failed', res.status, await res.text())
    }
  } catch (err) {
    // Never throw: a Telegram outage or misconfiguration must not surface
    // as a failure anywhere this is called from.
    console.error('Telegram sendMessage threw', err)
  }
}

async function notifyAdmin(text: string): Promise<void> {
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  if (!chatId) {
    console.error(
      'Telegram notification skipped: TELEGRAM_ADMIN_CHAT_ID is not set',
    )
    return
  }

  await sendTelegramMessage(process.env.TELEGRAM_BOT_TOKEN, chatId, text)
}

export async function notifyNewRequest(
  input: NewRequestNotification,
): Promise<void> {
  await notifyAdmin(formatNewRequestMessage(input))
}

export async function notifyNewReview(
  input: NewReviewNotification,
): Promise<void> {
  await notifyAdmin(formatNewReviewMessage(input))
}

export async function notifyNewContactMessage(
  input: NewContactMessageNotification,
): Promise<void> {
  await notifyAdmin(formatNewContactMessage(input))
}

export async function notifyClient(
  chatId: string,
  text: string,
): Promise<void> {
  await sendTelegramMessage(process.env.TELEGRAM_CLIENT_BOT_TOKEN, chatId, text)
}
