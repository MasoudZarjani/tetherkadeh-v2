import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'
import { useAuth } from '@/composables/useAuth'

export const useProfile = () => {
  const { toggleOverlay } = useOverlayStore()
  const { showAlert } = useAlertStore()
  const { logout, user } = useAuth()
  const api = useApi()
  const { t } = useI18n()
  const localePath = useLocalePath()

  const dialog = ref(false)
  const isLoading = ref(false)

  const openModal = () => {
    dialog.value = true
  }

  let jalali = computed(() => {
    if (user.value?.birthday) {
      const newDate = new Date(user.value.birthday).toLocaleDateString('fa-IR')
      return `${newDate}`
    } else {
      return ''
    }
  })

  const confirm = async (newPassword: string, oldPassword: string) => {
    try {
      toggleOverlay(true)
      isLoading.value = true
      const payload = {
        oldPassword,
        newPassword,
      }
      await api.put('/api/v1/user', payload)
      showAlert({ text: t('alert.passwordSuccessChanged'), color: 'success' })
      logout()
      navigateTo(localePath('/auth/login'))
    } catch (error) {
    } finally {
      toggleOverlay(false)
      isLoading.value = false
      dialog.value = false
    }
  }

  return {
    dialog,
    user,
    jalali,
    isLoading,
    confirm,
    openModal,
  }
}
