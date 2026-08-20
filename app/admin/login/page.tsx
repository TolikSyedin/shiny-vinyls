import { AdminLoginForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Вхід — Shiny Vinyls',
}

export default function AdminLoginPage() {
  return (
    <PageContainer>
      <h1>Вхід</h1>
      <AdminLoginForm />
    </PageContainer>
  )
}
