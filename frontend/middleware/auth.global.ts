import { useAuthStore } from '@/stores/auth'

/**
 * Global auth middleware
 * Filename: middleware/auth.global.ts
 */
export default defineNuxtRouteMiddleware(async to => {
  // Skip on server-side
  if (import.meta.server) return

  const localePath = useLocalePath()
  const auth = useAuthStore()

  // Wait for auth to be ready
  if (!auth.isReady) {
    await new Promise<void>(resolve => {
      const check = () => {
        if (auth.isReady) {
          resolve()
        } else {
          requestAnimationFrame(check)
        }
      }
      check()
    })
  }

  // Check token expiry and logout if needed
  if (auth.token && auth.isTokenExpired) {
    auth.logout()
  }

  const requiresAuth = to.meta.requiresAuth === true
  const redirectIfAuth = to.meta.redirectIfAuthenticated === true
  const isPublic = to.meta.public === true

  
  // Redirect to login if authentication required
  if (requiresAuth && !auth.isAuthenticated) {
    return navigateTo(localePath('/auth/login'))
  }

  // Redirect to dashboard if already authenticated
  if (redirectIfAuth && auth.isAuthenticated) {
    return navigateTo(localePath('/dashboard'))
  }

  // Allow access to public routes
  if (isPublic || !requiresAuth) return
})
