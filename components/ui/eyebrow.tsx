import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export const EYEBROW_CLASS =
  'font-mono text-[0.6rem] tracking-[0.16em] text-[var(--muted)] uppercase'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={cx(EYEBROW_CLASS, className)}>{children}</span>
}
