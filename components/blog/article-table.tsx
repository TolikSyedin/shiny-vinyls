import { Mono } from '@/components/ui'

export function ArticleTable({
  head,
  rows,
}: {
  head: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--rule)]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {head.map((label) => (
              <th
                key={label}
                className="border-b border-[var(--rule)] bg-[var(--surface-2)] px-4 py-2 text-left"
              >
                <Mono tone="stamp" className="mono-label">
                  {label}
                </Mono>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row[0]}
              className={
                rowIndex > 0 ? 'border-t border-[var(--rule)]' : undefined
              }
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
