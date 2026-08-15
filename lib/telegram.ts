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

// Telegram's parse_mode: 'HTML' requires escaping any user-supplied text
// interpolated into the message — an unescaped `<`/`&` (e.g. in a client's
// comment) would make sendMessage fail with "can't parse entities", which
// (per sendTelegramMessage's never-throw contract) silently drops the whole
// notification instead of just breaking formatting.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatAdminLink(adminUrl: string, label: string): string {
  return `<a href="${escapeHtml(adminUrl)}">${escapeHtml(label)}</a>`
}

export function formatNewRequestMessage(input: NewRequestNotification): string {
  const lines = [
    `Нова заявка:`,
    `Ім'я: ${escapeHtml(input.name)}`,
    `Телефон: ${escapeHtml(input.phone)}`,
  ]
  if (input.comment) lines.push(`Коментар: ${escapeHtml(input.comment)}`)
  lines.push(formatAdminLink(input.adminUrl, 'Обробити заявку'))
  return lines.join('\n')
}

export function formatNewReviewMessage(input: NewReviewNotification): string {
  return [
    `Новий відгук:`,
    `Ім'я: ${escapeHtml(input.name)}`,
    `Рейтинг: ${input.rating}/5`,
    `Текст: ${escapeHtml(input.text)}`,
    formatAdminLink(input.adminUrl, 'Обробити відгук'),
  ].join('\n')
}

// Chat-id-agnostic on purpose: a future client-facing bot (notifying a
// client via their own requests.telegram_chat_id) can reuse this unchanged —
// only notifyAdmin below is admin-specific.
async function sendTelegramMessage(
  chatId: string,
  text: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!token) {
    console.error(
      'Telegram notification skipped: TELEGRAM_BOT_TOKEN is not set',
    )
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

  await sendTelegramMessage(chatId, text)
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
