import Link from 'next/link'
import { Mono, Wordmark } from '@/components/ui'
import { CONTACT_INFO } from '@/lib/data/contact-info/constants'

const LINK_CLASS_NAME =
  'text-[var(--muted)] no-underline hover:text-[var(--ink)]'

type FooterLink = { href: string; label: string; external?: boolean }

const FOOTER_LINK_COLUMNS: FooterLink[][] = [
  [
    { href: '/how-it-works', label: 'Послуга' },
    { href: '/reviews', label: 'Відгуки' },
  ],
  [
    { href: '/request', label: 'Замовлення' },
    { href: '/contacts', label: 'Контакти' },
  ],
  [
    {
      href: `tel:${CONTACT_INFO.phone.raw}`,
      label: CONTACT_INFO.phone.display,
      external: true,
    },
    { href: CONTACT_INFO.telegram.url, label: 'Telegram', external: true },
  ],
]

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-[var(--rule)] bg-[var(--surface-2)]">
      <div className="mx-auto flex w-full max-w-[70rem] flex-col gap-4 px-4 py-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <Wordmark size="sm">Shiny Vinyls</Wordmark>
          <Mono>Ультразвукове чищення вінілу · Київ</Mono>
        </div>
        {FOOTER_LINK_COLUMNS.map((column) => (
          <div key={column[0].href} className="flex flex-col items-start gap-4">
            {column.map(({ href, label, external }) =>
              external ? (
                <a key={href} href={href} className={LINK_CLASS_NAME}>
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} className={LINK_CLASS_NAME}>
                  {label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
    </footer>
  )
}
