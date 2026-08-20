import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type MonoTone = 'muted' | 'stamp' | 'ink'

const TONE: Record<MonoTone, string> = {
  muted: 'text-[var(--muted)]',
  stamp: 'text-[var(--stamp)]',
  ink: 'text-[var(--ink)]',
}

export function Mono({
  tone = 'muted',
  children,
  className,
}: {
  tone?: MonoTone
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cx('font-mono text-[0.82rem]', TONE[tone], className)}>
      {children}
    </span>
  )
}
