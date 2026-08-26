import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type NoteTone = 'muted' | 'ink'

const TONE: Record<NoteTone, string> = {
  muted: 'text-[var(--muted)]',
  ink: 'text-[var(--ink)]',
}

export function Note({
  tone = 'muted',
  children,
  className,
}: {
  tone?: NoteTone
  children: ReactNode
  className?: string
}) {
  return <p className={cx(TONE[tone], className)}>{children}</p>
}
