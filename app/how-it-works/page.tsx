import { PageContainer } from '@/components/layout'
import { PageHeader } from '@/components/common'

export const metadata = { title: 'Послуга — Shiny Vinyls' }

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Послуга"
        title="Основні кроки які продляють життя вашому вінілу"
        lead="Кожна платівка мріє про такий спа-салон, в якому її викупають в теплій ванні, помиють, посушать, і щайсливу й радісну відправлять назад до власників."
      />
    </PageContainer>
  )
}
