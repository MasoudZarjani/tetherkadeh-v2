import { useOverlayStore } from '~/stores/overlay'

interface ForgotPasswordState {
  user: string
  password: string
  confirmPassword: string
  userError: string | null
  passwordError: string | null
  confirmPasswordError: string | null
  isLoading: boolean
  isCodeSent: boolean
  isPasswordReset: boolean
}

export function useForgotPassword() {
  const { toggleOverlay } = useOverlayStore()
  const api = useApi()
  const localePath = useLocalePath()

  // State
  const state = reactive<ForgotPasswordState>({
    user: '',
    password: '',
    confirmPassword: '',
    userError: null,
    passwordError: null,
    confirmPasswordError: null,
    isLoading: false,
    isCodeSent: false,
    isPasswordReset: false,
  })

  // Validation watchers
  watch(
    () => state.user,
    val => {
      state.userError = useValidate(val, 'user')
    }
  )

  watch(
    () => state.password,
    val => {
      state.passwordError = useValidate(val, 'password')
      // Re-validate confirm password when password changes
      if (state.confirmPassword) {
        state.confirmPasswordError = state.confirmPassword !== val ? 'passwordNotMatch' : null
      }
    }
  )

  watch(
    () => state.confirmPassword,
    val => {
      state.confirmPasswordError = val && val !== state.password ? 'passwordNotMatch' : null
    }
  )

  // Actions
  const sendCode = async () => {
    state.userError = useValidate(state.user, 'user')

    if (state.userError) return

    state.isLoading = true
    toggleOverlay(true)

    try {
      await api.post('/api/v1/user/forgot-password', {
        user: useTrimNumber(state.user),
      })
      state.isCodeSent = true
    } finally {
      state.isLoading = false
      toggleOverlay(false)
    }
  }

  const verifyCode = async (code: string) => {
    if (!code || code.length === 0) return

    state.isLoading = true
    toggleOverlay(true)

    try {
      await api.post('/api/v1/user/verify-forgot-password', {
        code: +code,
        user: useTrimNumber(state.user),
      })
      state.isCodeSent = false
      state.isPasswordReset = true
    } finally {
      state.isLoading = false
      toggleOverlay(false)
    }
  }

  const changePassword = async () => {
    // Validate all fields
    state.passwordError = useValidate(state.password, 'password')
    state.confirmPasswordError =
      state.confirmPassword !== state.password ? 'passwordNotMatch' : null

    if (state.passwordError || state.confirmPasswordError) return

    state.isLoading = true
    toggleOverlay(true)

    try {
      await api.post('/api/v1/user/reset-password', {
        user: useTrimNumber(state.user),
        password: state.password,
      })

      // Reset state before navigation
      resetState()

      await navigateTo(localePath('/auth/login'))
    } finally {
      state.isLoading = false
      toggleOverlay(false)
    }
  }

  const sendAgain = async () => {
    if (!state.user) return

    state.isLoading = true

    try {
      await api.post('/api/v1/user/resend?lang=fa', {
        user: useTrimNumber(state.user),
      })
    } finally {
      state.isLoading = false
    }
  }

  // Reset state helper
  const resetState = () => {
    state.user = ''
    state.password = ''
    state.confirmPassword = ''
    state.userError = null
    state.passwordError = null
    state.confirmPasswordError = null
    state.isLoading = false
    state.isCodeSent = false
    state.isPasswordReset = false
  }

  return {
    // State (using toRefs for reactivity)
    ...toRefs(state),

    // Actions
    sendCode,
    verifyCode,
    changePassword,
    sendAgain,
    resetState,
  }
}
