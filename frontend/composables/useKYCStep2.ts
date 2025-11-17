import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'
import { useAuth } from '@/composables/useAuth'

export function useKYCStep2() {
  const { user, fetchProfile } = useAuth()

  const api = useApi()
  const localePath = useLocalePath()
  const { toggleOverlay } = useOverlayStore()
  const { showAlert } = useAlertStore()

  const imagePath = ref('')
  const videoPath = ref('')
  const isLoading = ref(false)

  const updateUser = async () => {
    if (!imagePath.value) {
      showAlert({ text: 'مدرک بارگزاری نشده است.', color: 'error' })
      return
    }
    try {
      isLoading.value = true
      toggleOverlay(true)
      const docs = [
        {
          name: 'frontNaCode',
          url: user.value?.docs?.[0]?.url || '',
        },
        {
          name: 'backNaCode',
          url: '',
        },
        {
          name: 'authPic',
          url: imagePath.value,
        },
        {
          name: 'authVideo',
          url: videoPath.value,
        },
      ]
      const payload = {
        firstName: user.value?.firstName ?? '',
        lastName: user.value?.lastName ?? '',
        nationalCode: user.value?.nationalCode ?? '',
        birthday: user.value?.birthday ?? '',
        postalCode: user.value?.postalCode ?? '',
        address: user.value?.address ?? '',
        docs,
        step: 'Step2',
      }
      await api.put('/api/v1/user/set-kyc', payload)
      showAlert({ text: 'مدارک شما با موفقیت ارسال گردید.', color: 'success' })
      await fetchProfile()
      navigateTo(localePath('/dashboard'))
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  return {
    user,
    imagePath,
    isLoading,
    updateUser,
  }
}
