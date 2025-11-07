import { useAuthStore } from '@/stores/auth'
import type { ComputedRef } from 'vue'
import type { User } from '~/types/user.types'

interface LoginCredentials {
  user: string
  password: string
  code?: string | null
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  fetchProfile: () => Promise<void>
  getProfile: () => Promise<User>
  setToken: (token: string) => void
  isLoggedIn: ComputedRef<boolean>
  user: ComputedRef<User | null>
  token: ComputedRef<string | null>
  isLoading: ComputedRef<boolean>
  isReady: ComputedRef<boolean>
}

/**
 * Composable for auth operations
 * Filename: composables/useAuth.ts
 */
export const useAuth = (): UseAuthReturn => {
  const auth = useAuthStore()
  const { locale } = useI18n()

  const login = (credentials: LoginCredentials) =>
    auth.login(credentials, { 'Accept-Language': locale.value })
  const logout = () => auth.logout()
  const fetchProfile = () => auth.fetchProfile()
  const getProfile = () => auth.getProfile()
  const setToken = (token: string) => auth.setToken(token)

  const isLoggedIn = computed(() => auth.isAuthenticated)
  const user = computed(() => auth.user)
  const token = computed(() => auth.token)
  const isLoading = computed(() => auth.isLoading)
  const isReady = computed(() => auth.isReady)

  return {
    login,
    logout,
    fetchProfile,
    getProfile,
    setToken,
    isLoggedIn,
    user,
    token,
    isLoading,
    isReady,
  }
}
