import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui'

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col items-start gap-4 pt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead ? <p>{lead}</p> : null}
      {children}
    </section>
  )
}
