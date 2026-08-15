import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // The `server-only` marker throws unconditionally unless resolved via
      // Next's "react-server" export condition, which vitest doesn't set —
      // no-op it so server-only modules stay unit-testable here.
      'server-only': path.resolve(__dirname, 'node_modules/server-only/empty.js'),
    },
  },
})
