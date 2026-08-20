import type { ReactNode } from 'react'
import { cx } from '@/lib/utils/cx'

export function Lead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cx(
        'max-w-[52ch] text-[clamp(1rem,1.5vw,1.12rem)] leading-[1.6]',
        className,
      )}
    >
      {children}
    </p>
  )
}
