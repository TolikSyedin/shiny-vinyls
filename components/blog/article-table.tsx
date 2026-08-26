import { Mono } from '@/components/ui'

export function ArticleTable({
  head,
  rows,
}: {
  head: string[]
  rows: string[][]
}) {
  return (
    <div className="my-[1.75rem] overflow-x-auto rounded-[0.3rem] border border-[var(--rule)]">
      <table className="w-full border-collapse text-[0.9rem]">
        <thead>
          <tr>
            {head.map((label) => (
              <th
                key={label}
                className="border-b border-[var(--rule)] bg-[var(--surface-2)] px-[0.9rem] py-[0.6rem] text-left"
              >
                <Mono tone="stamp" className="uppercase tracking-[0.06em]">
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
                <td
                  key={cellIndex}
                  className="px-[0.9rem] py-[0.6rem] align-top"
                >
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
