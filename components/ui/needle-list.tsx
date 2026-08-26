import { NeedleIcon } from '@/components/icons'
import { cx } from '@/lib/utils/cx'

export function NeedleList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cx('m-0 flex list-none flex-col gap-4 p-0', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <NeedleIcon size={22} className="flex-none" />
          {item}
        </li>
      ))}
    </ul>
  )
}
