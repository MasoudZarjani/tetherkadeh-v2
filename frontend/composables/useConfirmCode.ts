import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'
import { useAuth } from '@/composables/useAuth'
import type { Ref } from 'vue'

interface User {
  user: string
  password: string
}

export function useConfirmCode() {
  const { toggleOverlay } = useOverlayStore()
  const { login } = useAuth()
  const api = useApi()
  const localePath = useLocalePath()
  const { showAlert } = useAlertStore()
  const { t } = useI18n()

  const user: Ref<User | null> = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  // بارگذاری کاربر از localStorage
  onMounted(() => {
    if (import.meta.client) {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        }
      } catch (error) {
        console.error('خطا در خواندن اطلاعات کاربر:', error)
        navigateTo(localePath('/auth/login'))
        return
      }

      if (!user.value?.user) {
        navigateTo(localePath('/auth/login'))
      }
    }
  })

  // تأیید کد
  const confirm = async (code: string) => {
    if (!user.value?.user || !user.value?.password) {
      errorMessage.value = 'اطلاعات کاربر یافت نشد'
      navigateTo(localePath('/auth/login'))
      return
    }

    if (code.length !== 6) {
      errorMessage.value = 'کد وارد شده باید 6 رقمی باشد'
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''
      toggleOverlay(true)

      const payload = {
        user: user.value.user,
        code: parseInt(code, 10),
      }

      const credentials = {
        user: user.value.user,
        password: user.value.password,
      }

      await api.post('/api/v1/user/confirm', payload)

      // پاک کردن اطلاعات موقت
      if (import.meta.client) {
        localStorage.removeItem('user')
      }

      await login(credentials)

      showAlert({ text: t('alert.registerSuccessfull'), color: 'success' })
      navigateTo(localePath('/dashboard'))
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  // ارسال دوباره کد
  const sendAgain = async () => {
    if (!user.value?.user) {
      errorMessage.value = 'اطلاعات کاربر یافت نشد'
      return
    }

    try {
      isLoading.value = true
      errorMessage.value = ''

      await api.post('/api/v1/user/resend', { user: user.value.user })

      showAlert({ text: t('alert.sendAgainCode'), color: 'success' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    errorMessage,
    confirm,
    sendAgain,
  }
}
