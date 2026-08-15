import { describe, it, expect } from 'vitest'
import { parseCommand } from './telegram-commands'

describe('parseCommand', () => {
  it('розбирає команду без payload', () => {
    expect(parseCommand('/status')).toEqual({ command: '/status', payload: undefined })
  })

  it('розбирає /start з payload', () => {
    expect(parseCommand('/start abc-123')).toEqual({
      command: '/start',
      payload: 'abc-123',
    })
  })

  it('обрізає зайві пробіли навколо тексту', () => {
    expect(parseCommand('  /status  ')).toEqual({ command: '/status', payload: undefined })
  })

  it('склеює payload з кількох слів через пробіл', () => {
    expect(parseCommand('/start abc def')).toEqual({
      command: '/start',
      payload: 'abc def',
    })
  })
})
