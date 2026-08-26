import Link from 'next/link'
import { Mono, Wordmark } from '@/components/ui'
import { CONTACT_INFO } from '@/lib/data/contact-info/constants'

const LINK_CLASS_NAME =
  'text-[0.88rem] text-[var(--muted)] no-underline hover:text-[var(--ink)]'

type FooterLink = { href: string; label: string; external?: boolean }

const FOOTER_LINK_COLUMNS: FooterLink[][] = [
  [
    { href: '/how-it-works', label: 'Послуга' },
    { href: '/reviews', label: 'Відгуки' },
  ],
  [
    { href: '/request', label: 'Заявка' },
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
    <footer className="mt-4 md:mt-8 border-t border-[var(--rule)] bg-[var(--surface-2)]">
      <div className="mx-auto flex max-w-[70rem] flex-col gap-[1.5rem] px-[clamp(1rem,4vw,2.5rem)] py-[2rem] sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex flex-col gap-[0.5rem]">
          <Wordmark size="sm">Shiny Vinyls</Wordmark>
          <Mono>Ультразвукове чищення вінілу · Київ</Mono>
        </div>
        {FOOTER_LINK_COLUMNS.map((column) => (
          <div
            key={column[0].href}
            className="flex flex-col items-start gap-[0.5rem]"
          >
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
