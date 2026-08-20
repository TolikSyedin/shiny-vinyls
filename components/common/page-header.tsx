import type { ReactNode } from 'react'
import { Eyebrow, Lead } from '@/components/ui'

// The opening block every page shares: a mono label, the page title, and an
// optional lead. `children` takes anything that belongs directly under the
// lead, such as a row of tags. Admin screens deliberately skip this and write
// a bare <h1> instead — they have no lead to show.
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
    <section className="grid justify-items-start gap-[20px] pt-[clamp(40px,6vw,72px)]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {lead ? <Lead>{lead}</Lead> : null}
      {children}
    </section>
  )
}
