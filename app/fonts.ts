import { IBM_Plex_Mono, Manrope, Unbounded } from 'next/font/google'

export const fontDisplay = Unbounded({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['700', '900'],
  variable: '--f-display',
  display: 'swap',
})

export const fontBody = Manrope({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '700'],
  variable: '--f-body',
  display: 'swap',
})

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500'],
  variable: '--f-mono',
  display: 'swap',
})
