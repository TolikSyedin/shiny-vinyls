import { NeedleIcon } from '@/components/icons'
import { Card, CardGrid, Mono, Note } from '@/components/ui'
import { Section, SectionHeading } from './section'

export type CardGridItem = {
  href?: string
  label?: string
  title: string
  note: string
}

export function CardGridSection({
  eyebrow,
  heading,
  items,
  cols = 3,
}: {
  eyebrow: string
  heading: string
  items: CardGridItem[]
  cols?: 2 | 3 | 4
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow}>{heading}</SectionHeading>
      <CardGrid cols={cols}>
        {items.map(({ href, label, title, note }) => (
          <Card key={title} href={href}>
            {label && <Mono tone="stamp">{label}</Mono>}
            <h3 className="flex items-center gap-2">
              <NeedleIcon />
              {title}
            </h3>
            <Note>{note}</Note>
          </Card>
        ))}
      </CardGrid>
    </Section>
  )
}
