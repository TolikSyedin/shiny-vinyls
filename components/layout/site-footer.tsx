import Link from 'next/link'
import { Mono, Wordmark } from '@/components/ui'

const LINK_CLASS_NAME =
  'text-[0.88rem] text-[var(--muted)] no-underline hover:text-[var(--ink)]'

export function SiteFooter() {
  return (
    <footer className="mt-4 md:mt-8 border-t border-[var(--rule)] bg-[var(--surface-2)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-start justify-between gap-[22px] px-[clamp(16px,4vw,40px)] py-[34px]">
        <div className="grid gap-[8px]">
          <Wordmark size="sm">Shiny Vinyls</Wordmark>
          <Mono>Ультразвукове чищення вінілу · Київ</Mono>
        </div>
        <div className="grid gap-[7px]">
          <Link href="/how-it-works" className={LINK_CLASS_NAME}>
            Послуга
          </Link>
          <Link href="/reviews" className={LINK_CLASS_NAME}>
            Відгуки
          </Link>
        </div>
        <div className="grid gap-[7px]">
          <Link href="/request" className={LINK_CLASS_NAME}>
            Заявка
          </Link>
          <Link href="/contacts" className={LINK_CLASS_NAME}>
            Контакти
          </Link>
        </div>
        <div className="grid gap-[7px]">
          <a href="tel:+38067XXXXXXX" className={LINK_CLASS_NAME}>
            +38 067 XXX XX XX
          </a>
          <a href="https://t.me/dirtyenterta1n3r" className={LINK_CLASS_NAME}>
            Telegram
          </a>
        </div>
      </div>
    </footer>
  )
}
