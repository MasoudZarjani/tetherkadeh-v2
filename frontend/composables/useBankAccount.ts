import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'

export async function useBankAccount() {
  const api = useApi()
  const { toggleOverlay } = useOverlayStore()
  const { showAlert } = useAlertStore()
  const { user } = useAuth()
  const { t } = useI18n()

  const dialog = ref(false)
  const currentCard = ref(0)
  const cards: any = ref([])

  const totalCards = computed(() => cards.value?.total || 0)
  const currentBank = computed(() => cards.value?.data[currentCard.value])

  const dashedNumber = computed(
    () => currentBank.value?.cardNumber?.match(/.{1,4}/g)?.join('  ') || ''
  )

  const openModal = () => {
    if (['Approved', 'Trusted'].includes(user.value?.status ?? '')) {
      dialog.value = true
    } else {
      showAlert({ text: t('kycRequest'), color: 'error' })
    }
  }

  const confirm = async (cardNumber: string) => {
    try {
      toggleOverlay(true)
      let realNumber = cardNumber.replace(/-/gi, '')
      await api.post('/api/v1/bankAccount/newBankAccount?lang=fa', {
        bankCardNo: realNumber,
      })
      await getData()
    } finally {
      toggleOverlay(false)
      dialog.value = false
    }
  }

  const getData = async () => {
    try {
      toggleOverlay(true)
      cards.value = await api.get('/api/v1/bank-account/user')
    } finally {
      toggleOverlay(false)
    }
  }

  const goPrev = () => (currentCard.value = Math.max(currentCard.value - 1, 0))
  const goNext = () => (currentCard.value = Math.min(currentCard.value + 1, totalCards.value - 1))

  return {
    user,
    dialog,
    cards,
    currentCard,
    totalCards,
    dashedNumber,
    openModal,
    confirm,
    getData,
    goPrev,
    goNext,
  }
}
