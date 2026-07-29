import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="self-end">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-semibold">Shiny Vinyls</h1>
      <p className="text-muted-foreground">Скелет сторінки — контент попереду.</p>
    </main>
  )
}
