import { CONTACT_INFO } from '@/lib/data/contact-info/constants'
import { SITE } from '@/lib/data/site/constants'
import { PRICE_TIERS } from '@/lib/pricing'
import type { BlogArticle } from '@/lib/data/blog/articles'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const BUSINESS_ID = `${SITE.url}/#business`

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

function toPriceRange() {
  const prices = PRICE_TIERS.map(({ pricePerVinyl }) => pricePerVinyl)
  return `${Math.min(...prices)}–${Math.max(...prices)} ₴`
}

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/opengraph-image.jpg`,
    telephone: CONTACT_INFO.phone.raw,
    email: CONTACT_INFO.email,
    priceRange: toPriceRange(),
    sameAs: [CONTACT_INFO.telegram.url],
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

export function getBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${SITE.url}${path}`,
    })),
  }
}

export function getFaqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

export function getReviewsJsonLd(reviews: ApprovedReview[]) {
  if (reviews.length === 0) return null

  const ratingValue =
    reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: SITE.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: reviews.length,
    },
    review: reviews.map(({ name, rating, text }) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: text,
    })),
  }
}
