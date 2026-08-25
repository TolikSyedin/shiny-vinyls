import { describe, it, expect } from 'vitest'
import { vinylsWord } from '@/lib/utils/plural'

describe('vinylsWord', () => {
  it('однина для 1, 21, 31', () => {
    expect(vinylsWord(1)).toBe('платівка')
    expect(vinylsWord(21)).toBe('платівка')
    expect(vinylsWord(31)).toBe('платівка')
  })

  it('форма для 2–4 та 22–24', () => {
    expect(vinylsWord(2)).toBe('платівки')
    expect(vinylsWord(4)).toBe('платівки')
    expect(vinylsWord(23)).toBe('платівки')
  })

  it('множина для 5–20 та 11–14', () => {
    expect(vinylsWord(5)).toBe('платівок')
    expect(vinylsWord(11)).toBe('платівок')
    expect(vinylsWord(14)).toBe('платівок')
    expect(vinylsWord(20)).toBe('платівок')
  })
})
