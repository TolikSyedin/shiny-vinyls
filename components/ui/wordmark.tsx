import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type WordmarkSize = 'sm' | 'md'

const SIZE: Record<WordmarkSize, string> = {
  sm: 'text-[12px]',
  md: 'text-[13px]',
}

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
    <span
      className={cx(
        'font-display font-black tracking-[-0.01em] text-[var(--ink)] uppercase',
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
