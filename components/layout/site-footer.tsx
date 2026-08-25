import Link from 'next/link'
import { Mono, Wordmark } from '@/components/ui'

const LINK_CLASS_NAME =
  'text-[0.88rem] text-[var(--muted)] no-underline hover:text-[var(--ink)]'

export function SiteFooter() {
  return (
    <footer className="mt-4 md:mt-8 border-t border-[var(--rule)] bg-[var(--surface-2)]">
      <div className="mx-auto flex max-w-[70rem] flex-col gap-[1.5rem] px-[clamp(1rem,4vw,2.5rem)] py-[2rem] sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex flex-col gap-[0.5rem]">
          <Wordmark size="sm">Shiny Vinyls</Wordmark>
          <Mono>Ультразвукове чищення вінілу · Київ</Mono>
        </div>
        <div className="flex flex-col items-start gap-[0.5rem]">
          <Link href="/how-it-works" className={LINK_CLASS_NAME}>
            Послуга
          </Link>
          <Link href="/reviews" className={LINK_CLASS_NAME}>
            Відгуки
          </Link>
        </div>
        <div className="flex flex-col items-start gap-[0.5rem]">
          <Link href="/request" className={LINK_CLASS_NAME}>
            Заявка
          </Link>
          <Link href="/contacts" className={LINK_CLASS_NAME}>
            Контакти
          </Link>
        </div>
        <div className="flex flex-col items-start gap-[0.5rem]">
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
