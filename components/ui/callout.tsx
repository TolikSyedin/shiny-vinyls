import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

type CalloutTone = 'default' | 'warn'

const TONE: Record<CalloutTone, string> = {
  default: 'border-[var(--stamp)]',
  warn: 'border-[var(--sticker)]',
}

export function Callout({
  tone = 'default',
  children,
  className,
}: {
  tone?: CalloutTone
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('border-l-2 py-1 pl-4', TONE[tone], className)}>
      {children}
    </div>
  )
}
