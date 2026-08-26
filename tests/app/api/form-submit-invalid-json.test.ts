import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()
  return { ...actual, after: (fn: () => unknown) => fn() }
})

vi.mock('@/lib/repositories/requests', () => ({
  createRequest: vi.fn(async () => ({ id: 'req-1', status: 'new' })),
}))
vi.mock('@/lib/repositories/reviews', () => ({
  createReview: vi.fn(async () => ({ id: 'rev-1', status: 'pending' })),
}))
vi.mock('@/lib/repositories/contact-messages', () => ({
  createContactMessage: vi.fn(async () => ({ id: 'msg-1' })),
}))
vi.mock('@/lib/telegram/telegram', () => ({
  notifyNewRequest: vi.fn(async () => {}),
  notifyNewReview: vi.fn(async () => {}),
  notifyNewContactMessage: vi.fn(async () => {}),
}))

import { POST as postRequest } from '@/app/api/requests/route'
import { POST as postReview } from '@/app/api/reviews/route'
import { POST as postContactMessage } from '@/app/api/contact-messages/route'

function jsonRequest(url: string, rawBody: string) {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
  })
}

const routes = [
  {
    name: '/api/requests',
    url: 'http://localhost/api/requests',
    post: postRequest,
    validBody: { name: 'Андрій', phone: '+380501234567' },
  },
  {
    name: '/api/reviews',
    url: 'http://localhost/api/reviews',
    post: postReview,
    validBody: {
      name: 'Андрій',
      rating: 5,
      text: 'Дуже чисті платівки, дякую!',
    },
  },
  {
    name: '/api/contact-messages',
    url: 'http://localhost/api/contact-messages',
    post: postContactMessage,
    validBody: {
      name: 'Андрій',
      contact: '@andriy',
      message: 'Хочу почистити 10 платівок.',
    },
  },
] as const

beforeEach(() => {
  vi.clearAllMocks()
})

describe.each(routes)('POST $name', ({ url, post, validBody }) => {
  it('повертає 400, а не 500, коли тіло не є валідним JSON', async () => {
    const res = await post(jsonRequest(url, 'not json at all'))
    expect(res.status).toBe(400)
  })

  it('повертає 400 на порожнє тіло', async () => {
    const res = await post(jsonRequest(url, ''))
    expect(res.status).toBe(400)
  })

  it('усе ще приймає валідну заявку (201)', async () => {
    const res = await post(jsonRequest(url, JSON.stringify(validBody)))
    expect(res.status).toBe(201)
  })
})
