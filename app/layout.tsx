import './globals.css'
import { ThemeProvider } from '@/components/theme'
import { SiteHeader, SiteFooter } from '@/components/layout'
import { fontBody, fontDisplay, fontMono } from './fonts'

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
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
