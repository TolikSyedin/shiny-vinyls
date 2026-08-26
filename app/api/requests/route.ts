import { NextResponse, after } from 'next/server'
import { requestSchema } from '@/lib/schemas/request'
import { createRequest } from '@/lib/repositories/requests'
import { notifyNewRequest } from '@/lib/telegram/telegram'
import { readJsonBody } from '@/lib/api/json-body'

export async function POST(req: Request) {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = requestSchema.safeParse(body.data)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Honeypot: a filled `website` field means a bot. Respond 201 as if
  // nothing happened — no row is written, and the bot gets no signal that
  // it was caught.
  if (parsed.data.website) {
    return NextResponse.json(
      { id: crypto.randomUUID(), status: 'new' },
      { status: 201 },
    )
  }

  const { name, phone, comment } = parsed.data
  const result = await createRequest({ name, phone, comment })

  const adminUrl = `${new URL(req.url).origin}/admin/requests`
  after(() => notifyNewRequest({ name, phone, comment, adminUrl }))

  return NextResponse.json(result, { status: 201 })
}
