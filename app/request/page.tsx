import { RequestForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'
import { PageHeader, Section, SectionHeading } from '@/components/common'
import { VinylCalculator } from '@/components/calculator'

export const metadata = {
  title: 'Замовлення — Shiny Vinyls',
}

export default function RequestPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Замовлення"
        title="Залишити замовлення"
        lead="Напишіть кількість платівок і в якому вони стані — повернемось із терміном і сумою."
      />
      <VinylCalculator />
      <Section>
        <div className="flex flex-col gap-[1.5rem]">
          <SectionHeading eyebrow="Замовлення">Відправити замовлення</SectionHeading>
          <RequestForm />
        </div>
      </Section>
    </PageContainer>
  )
}
