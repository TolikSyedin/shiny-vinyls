import { CONTACT_INFO } from '@/lib/data/contact-info/constants'
import { SITE } from '@/lib/data/site/constants'
import type { BlogArticle } from '@/lib/data/blog/articles'

const DAY_ABBREVIATIONS: Record<string, string> = {
  Пн: 'Mo',
  Вт: 'Tu',
  Ср: 'We',
  Чт: 'Th',
  Пт: 'Fr',
  Сб: 'Sa',
  Нд: 'Su',
}

function toOpeningHours() {
  return CONTACT_INFO.hours
    .filter(({ time }) => time !== 'зачинено')
    .map(({ days, time }) => {
      const [from, to] = days.split('–').map((day) => DAY_ABBREVIATIONS[day])
      const dayPart = to ? `${from}-${to}` : from
      return `${dayPart} ${time.replace('–', '-')}`
    })
}

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    url: SITE.url,
    telephone: CONTACT_INFO.phone.raw,
    email: CONTACT_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressCountry: 'UA',
    },
    openingHours: toOpeningHours(),
  }
}

export function getArticleJsonLd(article: BlogArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    url: `${SITE.url}/blog/${article.slug}`,
    author: {
      '@type': 'Organization',
      name: SITE.name,
    },
  }
}
