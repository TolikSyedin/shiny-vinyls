import { RequestForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'
import { PageHeader } from '@/components/common'

export const metadata = {
  title: 'Заявка — Shiny Vinyls',
}

export default function RequestPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Заявка"
        title="Залишити заявку"
        lead="Напишіть кількість платівок і в якому вони стані — повернемось із терміном і сумою."
      />
      <RequestForm />
    </PageContainer>
  )
}
