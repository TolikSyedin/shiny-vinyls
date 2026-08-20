import { NextResponse, after } from 'next/server'
import { reviewSchema } from '@/lib/schemas/review'
import { createReview } from '@/lib/repositories/reviews'
import { notifyNewReview } from '@/lib/telegram/telegram'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = reviewSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Honeypot: a filled `website` field means a bot. Respond 201 as if
  // nothing happened — no row is written, and the bot gets no signal that
  // it was caught.
  if (parsed.data.website) {
    return NextResponse.json(
      { id: crypto.randomUUID(), status: 'pending' },
      { status: 201 },
    )
  }

  const { name, rating, text } = parsed.data
  const result = await createReview({ name, rating, text })

  const adminUrl = `${new URL(req.url).origin}/admin/reviews`
  after(() => notifyNewReview({ name, rating, text, adminUrl }))

  return NextResponse.json(result, { status: 201 })
}
