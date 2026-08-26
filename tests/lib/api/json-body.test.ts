import { describe, it, expect } from 'vitest'
import { readJsonBody } from '@/lib/api/json-body'

function request(rawBody: string) {
  return new Request('http://localhost/api/x', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: rawBody,
  })
}

describe('readJsonBody', () => {
  it('повертає розпарсені дані на валідному JSON', async () => {
    const result = await readJsonBody(request('{"name":"Андрій"}'))
    expect(result).toEqual({ ok: true, data: { name: 'Андрій' } })
  })

  it('приймає не-обʼєктний JSON як є (валідацію робить схема далі)', async () => {
    const result = await readJsonBody(request('42'))
    expect(result).toEqual({ ok: true, data: 42 })
  })

  it('повертає 400-відповідь на невалідний JSON', async () => {
    const result = await readJsonBody(request('{ broken'))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(400)
      await expect(result.response.json()).resolves.toEqual({
        error: 'Invalid JSON body',
      })
    }
  })

  it('повертає 400-відповідь на порожнє тіло', async () => {
    const result = await readJsonBody(request(''))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(400)
  })
})
