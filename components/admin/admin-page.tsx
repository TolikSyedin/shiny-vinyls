import type { ReactNode } from 'react'
import { PageContainer } from '@/components/layout'
import { AdminNav } from './admin-nav'

export function AdminPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 pt-8">
        <AdminNav />
        <h1>{title}</h1>
        {children}
      </div>
    </PageContainer>
  )
}
