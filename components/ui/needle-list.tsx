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
    <ul className={cx('m-0 grid list-none gap-[2px] p-0', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[13px] py-[9px] text-[0.93rem] leading-[1.5]"
        >
          <NeedleIcon size={22} className="mt-[3px] flex-none" />
          {item}
        </li>
      ))}
    </ul>
  )
}
