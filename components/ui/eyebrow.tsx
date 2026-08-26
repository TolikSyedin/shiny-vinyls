import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export const EYEBROW_CLASS = 'eyebrow'

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={cx(EYEBROW_CLASS, className)}>{children}</span>
}
