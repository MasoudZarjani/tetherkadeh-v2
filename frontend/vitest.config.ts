/// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '~': path.resolve(__dirname, './'), // ریشه پروژه
      '@': path.resolve(__dirname, './'), // اگر @ هم استفاده می‌کنید
    },
  },
})
