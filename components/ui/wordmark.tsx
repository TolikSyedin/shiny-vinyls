import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type WordmarkSize = 'sm' | 'md'

export function Wordmark({
  size = 'md',
  children,
  className,
}: {
  size?: WordmarkSize
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cx('wordmark', size === 'sm' && 'wordmark-sm', className)}>
      {children}
    </span>
  )
}
