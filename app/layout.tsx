import './globals.css'
import { ThemeProvider } from '@/components/theme'
import { SiteHeader, SiteFooter } from '@/components/layout'

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
    <html lang="uk" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
