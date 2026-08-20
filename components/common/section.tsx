import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui'
import { cx } from '@/lib/utils/cx'

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
        'mt-[clamp(3rem,7vw,5.5rem)] border-t border-[var(--rule)] pt-[1.5rem]',
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
    <div className="flex flex-col items-start gap-[0.6rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{children}</h2>
    </div>
  )
}
