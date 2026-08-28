import { RequestForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'
import { PageHeader, Section, SectionHeading } from '@/components/common'
import { VinylCalculator } from '@/components/calculator'

const LEAD =
  'Напишіть кількість платівок і в якому вони стані — повернемось із терміном і сумою.'

export const metadata = {
  title: 'Замовлення — Shiny Vinyls',
  description: LEAD,
  alternates: { canonical: '/request' },
}

export default function RequestPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Замовлення"
        title="Залишити замовлення"
        lead={LEAD}
      />
      <VinylCalculator />
      <Section>
        <SectionHeading eyebrow="Замовлення">
          Відправити замовлення
        </SectionHeading>
        <RequestForm />
      </Section>
    </PageContainer>
  )
}
