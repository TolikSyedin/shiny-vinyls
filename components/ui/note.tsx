import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type NoteTone = 'muted' | 'ink'

const TONE: Record<NoteTone, string> = {
  muted: 'text-[var(--muted)]',
  ink: 'text-[var(--ink)]',
}

export function Note({
  tone = 'muted',
  fullWidth = false,
  children,
  className,
}: {
  tone?: NoteTone
  fullWidth?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cx(
        fullWidth ? 'max-w-none' : 'max-w-[56ch]',
        'text-[0.87rem] leading-[1.62]',
        TONE[tone],
        className,
      )}
    >
      {children}
    </p>
  )
}
