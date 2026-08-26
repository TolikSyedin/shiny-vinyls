import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.TELEGRAM_CLIENT_WEBHOOK_SECRET = 'test-secret'

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()
  return { ...actual, after: (fn: () => unknown) => fn() }
})

vi.mock('@/lib/repositories/requests', () => ({
  createRequest: vi.fn(async () => ({ id: 'req-1', status: 'new' })),
  updateRequestStatus: vi.fn(async () => ({
    id: 'req-1',
    name: 'Андрій',
    phone: '+380501234567',
    comment: null,
    status: 'in_progress',
    telegram_chat_id: null,
    created_at: '2026-08-26T00:00:00Z',
  })),
  RequestNotFoundError: class RequestNotFoundError extends Error {},
  InvalidStatusTransitionError: class InvalidStatusTransitionError extends Error {},
  StatusConflictError: class StatusConflictError extends Error {},
}))

vi.mock('@/lib/repositories/reviews', () => ({
  createReview: vi.fn(async () => ({ id: 'rev-1', status: 'pending' })),
  updateReviewStatus: vi.fn(async () => ({
    id: 'rev-1',
    name: 'Андрій',
    rating: 5,
    text: 'Дуже чисті платівки, дякую!',
    status: 'approved',
    created_at: '2026-08-26T00:00:00Z',
  })),
  ReviewNotFoundError: class ReviewNotFoundError extends Error {},
}))

vi.mock('@/lib/repositories/contact-messages', () => ({
  createContactMessage: vi.fn(async () => ({ id: 'msg-1' })),
}))

vi.mock('@/lib/telegram/telegram', () => ({
  notifyNewRequest: vi.fn(async () => {}),
  notifyNewReview: vi.fn(async () => {}),
  notifyNewContactMessage: vi.fn(async () => {}),
  notifyClient: vi.fn(async () => {}),
}))

import { POST as postRequest } from '@/app/api/requests/route'
import { POST as postReview } from '@/app/api/reviews/route'
import { POST as postContactMessage } from '@/app/api/contact-messages/route'
import { PATCH as patchAdminRequest } from '@/app/api/admin/requests/[id]/route'
import { PATCH as patchAdminReview } from '@/app/api/admin/reviews/[id]/route'
import { POST as postClientWebhook } from '@/app/api/telegram/client-webhook/route'

function jsonRequest(url: string, rawBody: string, headers: HeadersInit = {}) {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: rawBody,
  })
}

const ID = '00000000-0000-0000-0000-000000000000'

beforeEach(() => {
  vi.clearAllMocks()
})

const publicForms = [
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

describe.each(publicForms)('POST $name', ({ url, post, validBody }) => {
  it('повертає 400, а не 500, коли тіло не є валідним JSON', async () => {
    const res = await post(jsonRequest(url, 'not json at all'))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid JSON body' })
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

const adminForms = [
  {
    name: '/api/admin/requests/[id]',
    url: `http://localhost/api/admin/requests/${ID}`,
    patch: patchAdminRequest,
    validBody: { status: 'in_progress' },
  },
  {
    name: '/api/admin/reviews/[id]',
    url: `http://localhost/api/admin/reviews/${ID}`,
    patch: patchAdminReview,
    validBody: { status: 'approved' },
  },
] as const

describe.each(adminForms)('PATCH $name', ({ url, patch, validBody }) => {
  const params = Promise.resolve({ id: ID })

  it('повертає 400, а не 500, коли тіло не є валідним JSON', async () => {
    const res = await patch(jsonRequest(url, '{ broken'), { params })
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Invalid JSON body' })
  })

  it('усе ще застосовує валідну зміну статусу (200)', async () => {
    const res = await patch(jsonRequest(url, JSON.stringify(validBody)), {
      params,
    })
    expect(res.status).toBe(200)
  })
})

describe('POST /api/telegram/client-webhook', () => {
  const url = 'http://localhost/api/telegram/client-webhook'
  const auth = { 'x-telegram-bot-api-secret-token': 'test-secret' }

  it('підтверджує 200, а не 500, коли тіло не є валідним JSON', async () => {
    const res = await postClientWebhook(jsonRequest(url, 'not json', auth))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
  })

  it('усе ще відхиляє запит без секрету (401)', async () => {
    const res = await postClientWebhook(jsonRequest(url, 'not json'))
    expect(res.status).toBe(401)
  })

  it('приймає валідний апдейт без повідомлення (200)', async () => {
    const res = await postClientWebhook(jsonRequest(url, '{}', auth))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
  })
})
