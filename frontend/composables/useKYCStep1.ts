import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'
import jmoment from 'jalali-moment'
import { useAuth } from '@/composables/useAuth'

export function useKYCStep1() {
  const { user, getProfile } = useAuth()
  const { toggleOverlay } = useOverlayStore()
  const api = useApi()
  const localePath = useLocalePath()
  const { showAlert } = useAlertStore()

  const isOpen = ref(false)
  const userData = ref({
    firstName: '',
    lastName: '',
    nationalCode: '',
    birthday: '',
    postalCode: '',
    address: '',
  })
  const email = ref(user.value?.email || '')
  const mobile = ref(user.value?.mobile || '')
  const typeCode = ref('')
  const checkVerify = ref(false)
  const isLoading = ref(false)
  const mobileError: Ref<string | null> = ref(null)
  const emailError: Ref<string | null> = ref(null)
  const imagePath = ref('')

  const sendVerifyCode = async (type: string) => {
    toggleOverlay(true)
    isLoading.value = true
    try {
      if (type === 'email') emailError.value = useValidate(email.value, 'email')
      else if (type === 'mobile') mobileError.value = useValidate(mobile.value, 'mobile')

      if (emailError.value !== null || mobileError.value !== null) return
      const url = type === 'email' ? `/api/v1/user/set-email` : `/api/v1/user/set-mobile`

      let payload = {
        [type]: type === 'email' ? email.value : mobile.value,
      }
      await api.post(`${url}`, payload)
      isOpen.value = true
      typeCode.value = type
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  const checkCode = async (code: string) => {
    toggleOverlay(true)
    isLoading.value = true
    try {
      await api.post(`/api/v1/user/verify-code`, { code })
      isOpen.value = false
      checkVerify.value = true
      if (typeCode.value === 'email')
        showAlert({ text: 'ایمیل شما با موفقیت تایید شد.', color: 'success' })
      else
        showAlert({
          text: 'شماره همراه شما با موفقیت تایید شد.',
          color: 'success',
        })
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  const updateUser = async () => {
    try {
      if (userData.value.birthday === '') {
        showAlert({ text: 'تاریخ تولد وارد نشده است.', color: 'error' })
        return
      }
      if (!imagePath.value) {
        showAlert({ text: 'مدرک بارگزاری نشده است.', color: 'error' })
        return
      }
      isLoading.value = true
      toggleOverlay(true)
      const docs = [
        {
          name: 'frontNationalCode',
          url: imagePath.value,
        },
        {
          name: 'backNationalCode',
          url: '',
        },
        {
          name: 'authPic',
          url: '',
        },
        {
          name: 'authVideo',
          url: '',
        },
      ]

      let birthDay = jmoment(userData.value.birthday, 'jYYYY/jMM/jDD')
        .locale('en')
        .format('YYYY-MM-DD')
      const payload = {
        firstName: userData.value.firstName,
        lastName: userData.value.lastName,
        nationalCode: useTrimNumber(userData.value.nationalCode),
        birthday: birthDay,
        postalCode: userData.value.postalCode,
        address: userData.value.address,
        docs,
        step: 'Step1',
      }
      await api.put('/api/v1/user/set-kyc', payload)
      showAlert({ text: 'مدارک شما با موفقیت ارسال گردید.', color: 'success' })
      await getProfile()
      navigateTo(localePath('/dashboard'))
    } finally {
      toggleOverlay(false)
      isLoading.value = false
    }
  }

  onBeforeMount(() => {
    if (user.value?.isEmailVerified && user.value?.isMobileVerified) checkVerify.value = true
    if (user.value?.stepRequest === 'Step1' || user.value?.stepAuth === 'Step2')
      navigateTo(localePath('/dashboard/kyc/step2'))
  })

  return {
    user,
    userData,
    isOpen,
    email,
    mobile,
    sendVerifyCode,
    checkCode,
    updateUser,
    checkVerify,
    isLoading,
    mobileError,
    emailError,
    imagePath,
  }
}
