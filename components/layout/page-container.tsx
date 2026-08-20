import type { ReactNode } from 'react'

const BASE =
  'mx-auto w-full flex-1 flex flex-col gap-8 py-8 px-4 sm:px-6 lg:px-8 md:max-w-2xl lg:max-w-4xl xl:max-w-[1120px]'

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className={BASE}>{children}</main>
}
