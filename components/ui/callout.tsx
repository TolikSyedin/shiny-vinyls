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
    <div
      className={cx(
        'border-l-2 py-[0.15rem] pl-[1.1rem] text-[1rem] leading-[1.62]',
        TONE[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}
