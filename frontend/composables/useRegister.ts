import type { ImplicitFlowSuccessResponse, ImplicitFlowErrorResponse } from 'vue3-google-signin'
import { useCodeClient } from 'vue3-google-signin'
import { useAlertStore } from '~/stores/alert'
import { useOverlayStore } from '~/stores/overlay'
import { useAuth } from '@/composables/useAuth'

interface RegisterCredentials {
  user: string
  password: string
  invitedBy: string | null
}

interface GoogleAuthResponse {
  token: string
}

export function useRegister() {
  const { t } = useI18n()
  const api = useApi()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()

  const { toggleOverlay } = useOverlayStore()
  const { showAlert } = useAlertStore()
  const { getProfile, setToken } = useAuth()

  // Form State
  const user = ref('')
  const password = ref('')
  const invitedBy = ref<string | null>(null)
  const isChecked = ref(false)
  const isLoading = ref(false)

  // Error State
  const userError = ref<string | null>(null)
  const passwordError = ref<string | null>(null)
  const invitedByError = ref<string | null>(null)

  // Real-time Validation
  watch(user, val => {
    userError.value = useValidate(val, 'user')
  })

  watch(password, val => {
    passwordError.value = useValidate(val, 'password')
  })

  // Form Validation
  const validateForm = () => {
    userError.value = useValidate(user.value, 'user')
    passwordError.value = useValidate(password.value, 'password')

    const hasErrors = userError.value || passwordError.value

    if (!hasErrors) {
      register()
    }
  }

  // Traditional Registration
  const register = async () => {
    if (!isChecked.value) {
      showAlert({
        text: t('alert.termsAndConditionsChecked'),
        color: 'error',
      })
      return
    }

    isLoading.value = true
    toggleOverlay(true)

    try {
      const credentials: RegisterCredentials = {
        user: useTrimNumber(user.value),
        password: password.value,
        invitedBy: invitedBy.value,
      }

      await api.post('/api/v1/user/register', credentials)

      // Store credentials for confirmation page
      localStorage.setItem('user', JSON.stringify(credentials))

      await navigateTo(localePath('/auth/confirm'))
    } catch (error) {
      console.error('Registration error:', error)
      showAlert({
        text: t('alert.registrationFailed'),
        color: 'error',
      })
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  // Google Login Success Handler
  const handleOnSuccess = async (response: ImplicitFlowSuccessResponse) => {
    toggleOverlay(true)

    try {
      const { data, error } = await useFetch<GoogleAuthResponse>(
        `${config.public.baseURL}/api/v1/user/google`,
        {
          method: 'POST',
          body: { code: response.code },
        }
      )

      if (error.value) {
        throw new Error('Google authentication failed')
      }

      if (data.value?.token) {
        setToken(data.value.token)
        await getProfile()
        await navigateTo(localePath('/'))
      }
    } catch (error) {
      console.error('Google login error:', error)
      showAlert({
        text: t('alert.googleLoginFailed'),
        color: 'error',
      })
    } finally {
      toggleOverlay(false)
    }
  }

  // Google Login Error Handler
  const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
    console.error('Google OAuth error:', errorResponse)
    showAlert({
      text: t('alert.googleLoginError'),
      color: 'error',
    })
  }

  // Google Code Client
  const { isReady, login } = useCodeClient({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  })

  const loginWithGoogle = () => {
    if (!isReady.value) {
      showAlert({
        text: t('alert.googleNotReady'),
        color: 'error',
      })
      return
    }

    login()
  }

  return {
    // Form Data
    user,
    password,
    invitedBy,
    isChecked,

    // State
    isLoading,
    isReady,

    // Errors
    userError,
    passwordError,
    invitedByError,

    // Methods
    validateForm,
    loginWithGoogle,
  }
}
