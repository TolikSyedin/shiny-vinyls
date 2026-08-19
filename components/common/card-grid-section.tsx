import Link from 'next/link'
import { NeedleIcon } from '@/components/icons'

export type CardGridItem = {
  href?: string
  label?: string
  title: string
  note: string
}

export const CARD_CLASS_NAME =
  'grid gap-[10px] rounded-[6px] border border-[var(--rule)] bg-[var(--surface-2)] p-[22px] text-[var(--ink)] no-underline'

function CardBody({ label, title, note }: Omit<CardGridItem, 'href'>) {
  return (
    <>
      {label && (
        <span className="font-[family-name:var(--f-mono)] text-[0.82rem] text-[var(--stamp)]">
          {label}
        </span>
      )}
      <h3 className="m-0 flex items-center gap-[8px] font-[family-name:var(--f-display)] text-[0.9rem] font-bold tracking-[-0.005em] uppercase">
        <NeedleIcon />
        {title}
      </h3>
      <p className="m-0 max-w-[56ch] text-[0.87rem] leading-[1.62] text-[var(--muted)]">
        {note}
      </p>
    </>
  )
}

export function CardGridSection({
  eyebrow,
  heading,
  items,
}: {
  eyebrow: string
  heading: string
  items: CardGridItem[]
}) {
  return (
    <section className="mt-[clamp(48px,7vw,84px)] border-t border-[var(--rule)] pt-[30px]">
      <div className="mb-[10px] font-[family-name:var(--f-mono)] text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
        {eyebrow}
      </div>
      <h2 className="m-0 mb-[16px] font-[family-name:var(--f-display)] text-[clamp(1.05rem,2.4vw,1.45rem)] font-bold tracking-[-0.01em] uppercase">
        {heading}
      </h2>
      <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(14px,2vw,22px)]">
        {items.map(({ href, label, title, note }) =>
          href ? (
            <Link key={title} href={href} className={CARD_CLASS_NAME}>
              <CardBody label={label} title={title} note={note} />
            </Link>
          ) : (
            <div key={title} className={CARD_CLASS_NAME}>
              <CardBody label={label} title={title} note={note} />
            </div>
          ),
        )}
      </div>
    </section>
  )
}
