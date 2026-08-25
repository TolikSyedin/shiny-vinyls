'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const BASE =
  'mx-auto w-full flex flex-col flex-1 p-4 sm:px-6 lg:px-8 lg:max-w-[60rem] xl:max-w-[70rem]'

export function PageContainer({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    mainRef.current?.focus()
  }, [pathname])

  return (
    <main ref={mainRef} tabIndex={-1} className={BASE}>
      {children}
    </main>
  )
}
