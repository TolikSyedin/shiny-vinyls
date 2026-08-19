import { RequestForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Заявка — Shiny Vinyls',
}

export default function RequestPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Залишити заявку</h1>
      <RequestForm />
    </PageContainer>
  )
}
