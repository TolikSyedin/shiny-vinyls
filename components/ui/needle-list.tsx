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
    <ul className={cx('m-0 flex list-none flex-col gap-[0.1rem] p-0', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[0.75rem] py-[0.5rem] text-[1rem] leading-[1.5]"
        >
          <NeedleIcon size={22} className="mt-[0.2rem] flex-none" />
          {item}
        </li>
      ))}
    </ul>
  )
}
