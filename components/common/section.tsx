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
        'flex flex-col gap-4 border-t border-[var(--rule)] pt-8',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{children}</h2>
    </div>
  )
}
