import type { ReactNode } from 'react'

const BASE =
  'mx-auto w-full flex flex-col flex-1 px-4 sm:px-6 lg:px-8 lg:max-w-[60rem] xl:max-w-[70rem]'

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className={BASE}>
      {children}
    </main>
  )
}
