import ApiService from '@/utils/ApiService'
import { useAlertStore } from '~/stores/alert'
import { useAuth } from '@/composables/useAuth'

type NotifyFn = (options: { text: string; color?: string }) => void

export const useApi = () => {
  const config = useRuntimeConfig()
  const notifyStore = useAlertStore()
  const { token, logout } = useAuth()
  const localePath = useLocalePath()
  const { locale } = useI18n()

  const logoutAndRedirect = () => {
    logout()
    navigateTo(localePath('/auth/login'))
  }

  const apiUrl = import.meta.server ? config.API_INTERNAL_URL : config.public.baseURL
  return new ApiService(
    apiUrl as string,
    token.value,
    notifyStore.showAlert as NotifyFn,
    logoutAndRedirect,
    locale.value
  )
}
