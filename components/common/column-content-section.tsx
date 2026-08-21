import Link from 'next/link'
import type { ReactNode } from 'react'
import { Mono, Note } from '@/components/ui'
import { cx } from '@/lib/utils/cx'
import { Section, SectionHeading } from './section'

export type ColumnContentItem = {
  kicker: string
  body: ReactNode
  highlight?: boolean
  href?: string
}

function ColumnContentRow({
  kicker,
  body,
  highlight,
  href,
  className,
}: ColumnContentItem & { className?: string }) {
  const classes = cx(
    'block border border-[var(--rule)] p-[clamp(1rem,2.5vw,1.5rem)] text-[var(--ink)] no-underline',
    highlight
      ? 'relative z-10 border-[var(--stamp)] bg-[var(--stamp)]/10'
      : 'bg-[var(--surface-2)]',
    href && 'transition-colors hover:border-[var(--stamp)]',
    className,
  )
  const content = (
    <>
      <Mono tone={highlight ? 'stamp' : 'muted'} className="uppercase tracking-[0.08em]">
        {kicker}
      </Mono>
      <Note className="mt-[0.5rem] max-w-none">{body}</Note>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return <div className={classes}>{content}</div>
}

export function ColumnContentSection({
  eyebrow,
  heading,
  items,
  footnote,
  children,
}: {
  eyebrow: string
  heading: string
  items: ColumnContentItem[]
  footnote?: ReactNode
  children?: ReactNode
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow}>{heading}</SectionHeading>
      <div className="mt-[1.5rem] flex flex-col">
        {items.map((item, index) => (
          <ColumnContentRow
            key={item.kicker}
            {...item}
            className={cx(
              index > 0 && '-mt-px',
              index === 0 && 'rounded-t-[0.3rem]',
              index === items.length - 1 && 'rounded-b-[0.3rem]',
            )}
          />
        ))}
      </div>
      {footnote ? <Note className="mt-[1.125rem]">{footnote}</Note> : null}
      {children}
    </Section>
  )
}
