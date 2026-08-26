import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type NoteTone = 'muted' | 'ink'

const TONE: Record<NoteTone, string> = {
  muted: 'text-[var(--muted)]',
  ink: 'text-[var(--ink)]',
}

export function Note({
  tone = 'muted',
  compact = false,
  children,
  className,
}: {
  tone?: NoteTone
  compact?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cx(
        compact ? 'max-w-[56ch]' : 'max-w-none',
        'text-[0.87rem] leading-[1.62]',
        TONE[tone],
        className,
      )}
    >
      {children}
    </p>
  )
}
