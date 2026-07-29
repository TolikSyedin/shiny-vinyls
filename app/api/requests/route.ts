import { NextResponse } from 'next/server'
import { requestSchema } from '@/lib/schemas/request'
import { createRequest } from '@/lib/repositories/requests'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // Honeypot: a filled `website` field means a bot. Respond 201 as if
  // nothing happened — no row is written, and the bot gets no signal that
  // it was caught.
  if (parsed.data.website) {
    return NextResponse.json({ id: crypto.randomUUID(), status: 'new' }, { status: 201 })
  }

  const { name, phone, comment } = parsed.data
  const result = await createRequest({ name, phone, comment })

  return NextResponse.json(result, { status: 201 })
}
