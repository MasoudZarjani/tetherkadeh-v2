import { useAuthStore } from '@/stores/auth'

/**
 * Client-only auth initialization plugin
 * Filename: plugins/auth.client.ts
 */
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  // Initialize auth state from localStorage
  if (!auth.isReady) {
    await auth.initialize()
  }
})