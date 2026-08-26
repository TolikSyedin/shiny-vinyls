import { AdminLoginForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Вхід — Shiny Vinyls',
}

export default function AdminLoginPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pt-8">
        <h1>Вхід</h1>
        <AdminLoginForm />
      </div>
    </PageContainer>
  )
}
