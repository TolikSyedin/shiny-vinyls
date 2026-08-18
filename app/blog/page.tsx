import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Блог — Shiny Vinyls',
}

export default function BlogPage() {
  return (
    <PageContainer className="flex flex-col gap-4 py-8">
      <h1 className="text-2xl font-semibold">Блог</h1>
      <p className="text-muted-foreground">Тут скоро зʼявляться статті.</p>
    </PageContainer>
  )
}
