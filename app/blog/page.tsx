import { PageContainer } from '@/components/layout'
import { PageHeader } from '@/components/common'

export const metadata = {
  title: 'Блог — Shiny Vinyls',
}

export default function BlogPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Блог"
        title="Догляд за вінілом без міфів"
        lead="Тут скоро зʼявляться статті."
      />
    </PageContainer>
  )
}
