import { AdminLoginForm } from '@/components/forms'

export const metadata = {
  title: 'Вхід — Shiny Vinyls',
}

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Вхід для адміністратора</h1>
      <AdminLoginForm />
    </main>
  )
}
