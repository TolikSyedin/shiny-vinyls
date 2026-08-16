import './globals.css'
import { ThemeProvider } from '@/components/theme'
import { SiteHeader, SiteFooter, PitchFader } from '@/components/layout'

export const metadata = {
  title: 'Shiny Vinyls',
  description: 'Ультразвукова мийка вінілових платівок',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <PitchFader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
