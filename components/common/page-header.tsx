import type { ReactNode } from 'react'
import { Eyebrow, Lead } from '@/components/ui'

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
    <section className="flex flex-col items-start gap-4 pt-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead ? <Lead>{lead}</Lead> : null}
      {children}
    </section>
  )
}
