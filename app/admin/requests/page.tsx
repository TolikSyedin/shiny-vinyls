import { listRequests } from '@/lib/repositories/requests'
import { adminRequestStatusLabels } from '@/lib/data/admin-statuses/constants'
import { AdminPage } from '@/components/admin/admin-page'
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/admin-table'
import { RequestStatusControl } from '@/components/admin/request-status-control'
import { Note } from '@/components/ui'

export const metadata = {
  title: 'Замовлення — Адмін — Shiny Vinyls',
}

export const dynamic = 'force-dynamic'

type RequestRow = Awaited<ReturnType<typeof listRequests>>[number]

const columns: AdminTableColumn<RequestRow>[] = [
  { key: 'name', header: 'Імʼя', cell: (request) => request.name },
  { key: 'phone', header: 'Телефон', cell: (request) => request.phone },
  {
    key: 'comment',
    header: 'Коментар',
    cell: (request) => request.comment ?? '—',
  },
  {
    key: 'status',
    header: 'Статус',
    cell: (request) => adminRequestStatusLabels[request.status],
  },
  {
    key: 'created',
    header: 'Створено',
    cell: (request) => new Date(request.created_at).toLocaleDateString('uk-UA'),
  },
  {
    key: 'control',
    header: '',
    cell: (request) => (
      <RequestStatusControl id={request.id} status={request.status} />
    ),
  },
]

export default async function AdminRequestsPage() {
  const requests = await listRequests()

  return (
    <AdminPage title="Замовлення">
      {requests.length === 0 ? (
        <Note>Замовлень ще немає.</Note>
      ) : (
        <AdminTable
          columns={columns}
          rows={requests}
          rowKey={(request) => request.id}
        />
      )}
    </AdminPage>
  )
}
