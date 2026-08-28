import { CONTACT_INFO } from '@/lib/data/contact-info/constants'
import { SITE } from '@/lib/data/site/constants'
import { priceRangeLabel } from '@/lib/pricing'
import type { BlogArticle } from '@/lib/data/blog/articles'
import type { ApprovedReview } from '@/lib/repositories/reviews'

const BUSINESS_ID = `${SITE.url}/#business`

const WEEK_DAYS = [
  { short: 'Пн', name: 'Monday' },
  { short: 'Вт', name: 'Tuesday' },
  { short: 'Ср', name: 'Wednesday' },
  { short: 'Чт', name: 'Thursday' },
  { short: 'Пт', name: 'Friday' },
  { short: 'Сб', name: 'Saturday' },
  { short: 'Нд', name: 'Sunday' },
] as const

function expandDayRange(days: string) {
  const [from, to] = days.split('–')
  const fromIndex = WEEK_DAYS.findIndex((day) => day.short === from)
  const toIndex = to
    ? WEEK_DAYS.findIndex((day) => day.short === to)
    : fromIndex
  if (fromIndex === -1 || toIndex === -1) {
    throw new Error(`Unknown day abbreviation in "${days}"`)
  }
  return WEEK_DAYS.slice(fromIndex, toIndex + 1).map((day) => day.name)
}

function toOpeningHoursSpecification() {
  return CONTACT_INFO.hours
    .filter(({ time }) => time !== 'зачинено')
    .map(({ days, time }) => {
      const [opens, closes] = time.split('–')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: expandDayRange(days),
        opens,
        closes,
      }
    })
}

function getBusinessBase() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: SITE.name,
  }
}

export function getLocalBusinessJsonLd() {
  return {
    ...getBusinessBase(),
    url: SITE.url,
    image: `${SITE.url}${SITE.ogImagePath}`,
    telephone: CONTACT_INFO.phone.raw,
    email: CONTACT_INFO.email,
    priceRange: priceRangeLabel(),
    sameAs: [CONTACT_INFO.telegram.url],
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressCountry: 'UA',
    },
    openingHoursSpecification: toOpeningHoursSpecification(),
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
    ...getBusinessBase(),
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
