import Link from 'next/link'
import type { ReactNode } from 'react'
import { Mono, Note } from '@/components/ui'
import { cx } from '@/lib/utils/cx'
import { Section, SectionHeading } from './section'

export type ColumnContentItem = {
  kicker: string
  meta?: string
  title?: ReactNode
  body: ReactNode
  highlight?: boolean
  href?: string
}

function ColumnContentRow({
  kicker,
  meta,
  title,
  body,
  highlight,
  href,
  className,
}: ColumnContentItem & { className?: string }) {
  const classes = cx(
    'flex flex-col gap-4 rounded-[0.3rem] border border-[var(--rule)] p-4 text-[var(--ink)]',
    highlight
      ? 'relative z-10 border-[var(--stamp)] bg-[var(--stamp)]/10'
      : 'bg-[var(--surface-2)]',
    className,
  )
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <Mono
          tone={highlight ? 'stamp' : 'muted'}
          className="uppercase tracking-[0.08em]"
        >
          {kicker}
        </Mono>
        {meta ? (
          <Mono className="uppercase tracking-[0.08em]">{meta}</Mono>
        ) : null}
      </div>
      {title ? <h3 className="text-[var(--stamp)]">{title}</h3> : null}
      <Note>{body}</Note>
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
      <div className="flex flex-col">
        {items.map((item) => (
          <ColumnContentRow key={item.kicker} {...item} />
        ))}
      </div>
      {footnote ? <Note>{footnote}</Note> : null}
      {children}
    </Section>
  )
}
