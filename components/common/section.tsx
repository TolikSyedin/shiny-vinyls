import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui'
import { cx } from '@/lib/utils/cx'

// The rhythm every section below the page header follows: a rule, generous
// space above it, and the heading block at the top.
export function Section({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cx(
        'mt-[clamp(48px,7vw,84px)] border-t border-[var(--rule)] pt-[30px]',
        className,
      )}
    >
      {children}
    </section>
  )
}

// Label plus section title. Headings themselves carry no margin, so the gap
// between the two lives here — the one place that decides it.
export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: ReactNode
}) {
  return (
    <div className="grid justify-items-start gap-[10px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{children}</h2>
    </div>
  )
}
