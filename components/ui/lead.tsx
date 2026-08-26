import type { ReactNode } from 'react'

export function Lead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={className}>{children}</p>
}
