import Link from 'next/link'

const LINK_CLASS_NAME =
  'text-[0.88rem] text-[var(--muted)] no-underline hover:text-[var(--ink)]'

export function SiteFooter() {
  return (
    <footer className="mt-4 md:mt-8 border-t border-[var(--rule)] bg-[var(--surface-2)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-start justify-between gap-[22px] px-[clamp(16px,4vw,40px)] py-[34px]">
        <div className="grid gap-[8px]">
          <span className="font-[family-name:var(--f-display)] text-[12px] font-black tracking-[-0.01em] text-[var(--ink)] uppercase">
            Shiny Vinyls
          </span>
          <span className="font-[family-name:var(--f-mono)] text-[0.82rem] text-[var(--muted)]">
            Ультразвукове чищення вінілу · Київ
          </span>
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
