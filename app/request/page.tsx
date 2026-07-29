import { RequestForm } from '@/components/request-form'

export const metadata = {
  title: 'Заявка — Shiny Vinyls',
}

export default function RequestPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Залишити заявку</h1>
      <RequestForm />
    </main>
  )
}
