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
    'block rounded-[0.3rem] border border-[var(--rule)] p-[clamp(1rem,2.5vw,1.5rem)] text-[var(--ink)]',
    highlight
      ? 'relative z-10 border-[var(--stamp)] bg-[var(--stamp)]/10'
      : 'bg-[var(--surface-2)]',
    className,
  )
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-[0.5rem]">
        <Mono tone={highlight ? 'stamp' : 'muted'} className="uppercase tracking-[0.08em]">
          {kicker}
        </Mono>
        {meta ? <Mono className="uppercase tracking-[0.08em]">{meta}</Mono> : null}
      </div>
      {title ? <h3 className="mt-[0.5rem] text-[var(--stamp)]">{title}</h3> : null}
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
            className={index > 0 ? 'mt-[2px]' : undefined}
          />
        ))}
      </div>
      {footnote ? <Note className="mt-[1.125rem]">{footnote}</Note> : null}
      {children}
    </Section>
  )
}
