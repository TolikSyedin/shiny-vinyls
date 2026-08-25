import { NextResponse, after } from 'next/server'
import { contactMessageSchema } from '@/lib/schemas/contact-message'
import { createContactMessage } from '@/lib/repositories/contact-messages'
import { notifyNewContactMessage } from '@/lib/telegram/telegram'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = contactMessageSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Honeypot: a filled `website` field means a bot. Respond 201 as if
  // nothing happened — no row is written, and the bot gets no signal that
  // it was caught.
  if (parsed.data.website) {
    return NextResponse.json({ id: crypto.randomUUID() }, { status: 201 })
  }

  const { name, contact, message } = parsed.data
  const result = await createContactMessage({ name, contact, message })

  after(() => notifyNewContactMessage({ name, contact, message }))

  return NextResponse.json(result, { status: 201 })
}
