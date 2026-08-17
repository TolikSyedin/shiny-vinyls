import { VinylDisc } from '@/components/hero/vinyl-disc'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Shiny Vinyls</h1>
      <div className="flex">
        <p className="text-muted-foreground">
          Скелет сторінки — контент попереду.
        </p>
        <div style={{ width: 500, height: 500 }}>
          <VinylDisc />
        </div>
      </div>
    </main>
  )
}
