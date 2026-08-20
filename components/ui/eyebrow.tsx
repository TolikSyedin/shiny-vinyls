import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

// The small mono label that sits above a heading — `.lbl` in the brandbook.
// `className` is for spacing only; the type and colour are fixed here so the
// label reads the same on every page.
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
