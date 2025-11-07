import { useAlertStore } from '~/stores/alert'
import { useOverlayStore } from '~/stores/overlay'
import {
  useCodeClient,
  type ImplicitFlowSuccessResponse,
  type ImplicitFlowErrorResponse,
} from 'vue3-google-signin'
import { useAuth } from '@/composables/useAuth'

export function useLogin() {
  const { toggleOverlay } = useOverlayStore()
  const { showAlert } = useAlertStore()
  const { login: loginUser, setToken, getProfile } = useAuth()
  const { t } = useI18n()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()

  const user = ref('')
  const password = ref('')
  const code = ref<string | null>(null)

  const isLoading = ref(false)
  const isCodeSent = ref(false)

  // Validation
  const userError = computed(() => useValidate(user.value, 'user'))
  const passwordError = computed(() => useValidate(password.value, 'password'))

  const handleLoginError = (error: any) => {
    if (!error.status) {
      showAlert({ text: t('alert.serverError'), color: 'error' })
      return
    }

    showAlert({ text: error.data.message, color: 'error' })

    switch (error.status) {
      case 406:
        navigateTo(localePath('/auth/register'))
        break
      case 409:
        isCodeSent.value = true
        break
      case 405:
        isCodeSent.value = true
        break
    }
  }

  const loginLocal = async () => {
    if (userError.value || passwordError.value) return

    isLoading.value = true
    toggleOverlay(true)

    const credentials = {
      user: useTrimNumber(user.value),
      password: password.value,
      code: code.value,
    }

    try {
      await loginUser(credentials)
      navigateTo(localePath('/dashboard'))
    } catch (error: any) {
      handleLoginError(error)
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  const handleOnSuccess = async (response: ImplicitFlowSuccessResponse) => {
    // send code to a backend server to verify it.
    const { data, error }: any = await useFetch(`${config.public.baseURL}/api/v1/user/google`, {
      method: 'POST',
      body: JSON.stringify({
        code: response.code,
      }),
    })
    if (!error.value) {
      const item: any = data.value.data
      setToken(item.token)
      await getProfile()
      return navigateTo(localePath('/'))
    }
  }

  const loginWithGoogle = () => {
    if (isReady.value) {
      login()
    } else {
      showAlert({ text: t('alert.googleNotReady'), color: 'error' })
    }
  }

  const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
    console.log('Error: ', errorResponse)
  }

  const { isReady, login } = useCodeClient({
    onSuccess: handleOnSuccess,
    onError: handleOnError,
    // other options
  })

  const completed = (value: string) => {
    code.value = value
    loginLocal()
  }

  return {
    // state
    user,
    password,
    isLoading,
    isCodeSent,
    isReady,

    // validation
    userError,
    passwordError,

    // actions
    loginLocal,
    completed,
    loginWithGoogle,
  }
}
