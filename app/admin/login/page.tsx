import { AdminLoginForm } from '@/components/forms'
import { AdminPage } from '@/components/admin/admin-page'

export const metadata = {
  title: 'Вхід — Shiny Vinyls',
}

export default function AdminLoginPage() {
  return (
    <AdminPage title="Вхід" nav={false}>
      <AdminLoginForm />
    </AdminPage>
  )
}
