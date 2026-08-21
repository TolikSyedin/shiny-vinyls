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
    <section className="flex flex-col items-start gap-[1.25rem] pt-[clamp(2.5rem,6vw,4.5rem)]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead ? <Lead>{lead}</Lead> : null}
      {children}
    </section>
  )
}
