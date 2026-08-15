import { describe, it, expect } from 'vitest'
import {
  formatNewRequestMessage,
  formatNewReviewMessage,
  formatLinkedMessage,
  formatInvalidLinkMessage,
  formatNotLinkedMessage,
  formatHelpMessage,
} from '@/lib/telegram'

const adminUrl = 'http://localhost:3000/admin/requests'

describe('formatNewRequestMessage', () => {
  it('включає ім\'я та телефон', () => {
    const text = formatNewRequestMessage({ name: 'Олена', phone: '+380501234567', adminUrl })
    expect(text).toContain('Олена')
    expect(text).toContain('+380501234567')
  })

  it('додає коментар, якщо він переданий', () => {
    const text = formatNewRequestMessage({
      name: 'Олена',
      phone: '+380501234567',
      comment: '5 платівок, є подряпини',
      adminUrl,
    })
    expect(text).toContain('5 платівок, є подряпини')
  })

  it('не додає рядок коментаря, якщо його немає', () => {
    const text = formatNewRequestMessage({ name: 'Олена', phone: '+380501234567', adminUrl })
    expect(text).not.toContain('Коментар:')
  })

  it('обгортає посилання на адмінку в клікабельний <a> тег з підписом "Обробити заявку"', () => {
    const text = formatNewRequestMessage({ name: 'Олена', phone: '+380501234567', adminUrl })
    expect(text).toContain(`<a href="${adminUrl}">Обробити заявку</a>`)
  })

  it('екранує HTML-спецсимволи в полях, щоб не зламати parse_mode: HTML', () => {
    const text = formatNewRequestMessage({
      name: 'O\'Brien <script>',
      phone: '+380501234567',
      comment: 'A & B < C',
      adminUrl,
    })
    expect(text).toContain('O\'Brien &lt;script&gt;')
    expect(text).toContain('A &amp; B &lt; C')
    expect(text).not.toContain('<script>')
  })
})

describe('formatNewReviewMessage', () => {
  const reviewAdminUrl = 'http://localhost:3000/admin/reviews'

  it('включає ім\'я, рейтинг і текст відгуку', () => {
    const text = formatNewReviewMessage({
      name: 'Ігор',
      rating: 5,
      text: 'Дуже задоволений результатом',
      adminUrl: reviewAdminUrl,
    })
    expect(text).toContain('Ігор')
    expect(text).toContain('5/5')
    expect(text).toContain('Дуже задоволений результатом')
  })

  it('обгортає посилання на адмінку в клікабельний <a> тег з підписом "Обробити відгук"', () => {
    const text = formatNewReviewMessage({
      name: 'Ігор',
      rating: 5,
      text: 'Дуже задоволений результатом',
      adminUrl: reviewAdminUrl,
    })
    expect(text).toContain(`<a href="${reviewAdminUrl}">Обробити відгук</a>`)
  })

  it('екранує HTML-спецсимволи в тексті відгуку', () => {
    const text = formatNewReviewMessage({
      name: 'Ігор',
      rating: 5,
      text: '<b>дуже</b> задоволений & рекомендую',
      adminUrl: reviewAdminUrl,
    })
    expect(text).toContain('&lt;b&gt;дуже&lt;/b&gt; задоволений &amp; рекомендую')
    expect(text).not.toContain('<b>дуже</b>')
  })
})

describe('formatLinkedMessage', () => {
  it('включає ім\'я, телефон і статус-текст, щоб клієнт міг звірити заявку', () => {
    const text = formatLinkedMessage({
      name: 'Олена',
      phone: '+380501234567',
      statusMessage: 'Ваші платівки миються та сушаться',
    })
    expect(text).toContain('Олена')
    expect(text).toContain('+380501234567')
    expect(text).toContain('Ваші платівки миються та сушаться')
    expect(text).toContain('привʼязано')
  })

  it('додає коментар, якщо він переданий', () => {
    const text = formatLinkedMessage({
      name: 'Олена',
      phone: '+380501234567',
      comment: '5 платівок, є подряпини',
      statusMessage: 'Ваші платівки миються та сушаться',
    })
    expect(text).toContain('5 платівок, є подряпини')
  })

  it('не додає рядок коментаря, якщо його немає', () => {
    const text = formatLinkedMessage({
      name: 'Олена',
      phone: '+380501234567',
      statusMessage: 'Ваші платівки миються та сушаться',
    })
    expect(text).not.toContain('Коментар:')
  })

  it('екранує HTML-спецсимволи в імені й телефоні', () => {
    const text = formatLinkedMessage({
      name: 'O\'Brien <script>',
      phone: '+380501234567',
      statusMessage: 'Статус',
    })
    expect(text).toContain('O\'Brien &lt;script&gt;')
    expect(text).not.toContain('<script>')
  })
})

describe('formatInvalidLinkMessage', () => {
  it('повертає непорожнє повідомлення', () => {
    expect(formatInvalidLinkMessage().length).toBeGreaterThan(0)
  })
})

describe('formatNotLinkedMessage', () => {
  it('повертає непорожнє повідомлення', () => {
    expect(formatNotLinkedMessage().length).toBeGreaterThan(0)
  })
})

describe('formatHelpMessage', () => {
  it('згадує команду /status', () => {
    expect(formatHelpMessage()).toContain('/status')
  })
})
