'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Перемкнути тему"
      suppressHydrationWarning
      className="flex size-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
