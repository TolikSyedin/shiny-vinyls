import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'font-mono text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}
