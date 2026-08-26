import type { ReactNode } from 'react'

export type AdminTableColumn<T> = {
  key: string
  header?: string
  cell: (row: T) => ReactNode
}

export function AdminTable<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: AdminTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--rule)]">
            {columns.map((column) => (
              <th key={column.key} className="p-2">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-[var(--rule)]">
              {columns.map((column) => (
                <td key={column.key} className="p-2">
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
