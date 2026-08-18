import { AdminLoginForm } from '@/components/forms'
import { PageContainer } from '@/components/layout'

export const metadata = {
  title: 'Вхід — Shiny Vinyls',
}

export default function AdminLoginPage() {
  return (
    <PageContainer className="flex flex-col gap-4 py-8">
      <h1 className="text-2xl font-semibold">Вхід для адміністратора</h1>
      <AdminLoginForm />
    </PageContainer>
  )
}
