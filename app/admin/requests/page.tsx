import { listRequests } from '@/lib/repositories/requests'
import { adminRequestStatusLabels } from '@/lib/data/admin-statuses/constants'
import { AdminNav } from '@/components/admin/admin-nav'
import { RequestStatusControl } from '@/components/admin/request-status-control'
import { PageContainer } from '@/components/layout'
import { Note } from '@/components/ui'

export const metadata = {
  title: 'Заявки — Адмін — Shiny Vinyls',
}

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage() {
  const requests = await listRequests()

  return (
    <PageContainer>
      <AdminNav />
      <h1>Заявки</h1>

      {requests.length === 0 ? (
        <Note>Заявок ще немає.</Note>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2">Імʼія</th>
                <th className="p-2">Телефон</th>
                <th className="p-2">Коментар</th>
                <th className="p-2">Статус</th>
                <th className="p-2">Створено</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-border">
                  <td className="p-2">{request.name}</td>
                  <td className="p-2">{request.phone}</td>
                  <td className="p-2">{request.comment ?? '—'}</td>
                  <td className="p-2">
                    {adminRequestStatusLabels[request.status]}
                  </td>
                  <td className="p-2">
                    {new Date(request.created_at).toLocaleDateString('uk-UA')}
                  </td>
                  <td className="p-2">
                    <RequestStatusControl
                      id={request.id}
                      status={request.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  )
}
