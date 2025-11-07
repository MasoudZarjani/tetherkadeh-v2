import { useAlertStore } from '~/stores/alert'
import { computed, ref, watch, nextTick, type Ref } from 'vue'

// ==================== Bank Withdrawal ====================

// Constants for Bank Withdrawal
const MIN_WITHDRAW_AMOUNT = 200000 // IRT
const MAX_WITHDRAW_AMOUNT = 100000000 // IRT
const MIN_FEE = 7000 // IRT
const MAX_FEE = 15000 // IRT
const FEE_PERCENTAGE = 0.02 // 0.02%

interface BankAccount {
  _id: string
  [key: string]: any
}

interface Wallet {
  coin: string
  totalIRT?: number
  totalBlockedIRT?: number
  totalUSDT?: number
  totalBlockedUSDT?: number
  [key: string]: any
}

interface BankWithdrawItems {
  bankAccounts?: {
    data: BankAccount[]
  }
  wallets?: Wallet[]
}

export function useWithdrawBank(itemsRef: Ref<BankWithdrawItems>) {
  const { t } = useI18n()
  const router = useRouter()
  const { showAlert } = useAlertStore()
  const api = useApi()

  // State
  const selected = ref<BankAccount | undefined>(itemsRef.value?.bankAccounts?.data[0])
  const amount = ref('')
  const amountError = ref<string | undefined>(undefined)
  const isLoading = ref(false)
  const isOpen = ref(false)
  const walletId = ref('')

  // Computed
  const realAmount = computed(() => {
    return +useTrimNumber(amount.value?.replace(/,/gi, '')) || 0
  })

  const fee = computed(() => {
    const calculatedFee = (realAmount.value * FEE_PERCENTAGE) / 100
    return Math.min(Math.max(calculatedFee, MIN_FEE), MAX_FEE)
  })

  const irtWallet = computed(() => {
    if (!itemsRef.value?.wallets) {
      return {
        totalIRT: 0,
        totalBlockedIRT: 0,
      }
    }

    const wallet = itemsRef.value.wallets.find(item => item.coin === 'IRT')
    return wallet || { totalIRT: 0, totalBlockedIRT: 0 }
  })

  const availableBalance = computed(() => {
    return (irtWallet.value.totalIRT || 0) - (irtWallet.value.totalBlockedIRT || 0)
  })

  const receiptAmount = computed(() => {
    const receipt = realAmount.value - fee.value
    return receipt >= MIN_WITHDRAW_AMOUNT ? receipt : 0
  })

  // Watchers
  watch(amount, newVal => {
    const validationResult = useValidate(newVal, 'amount')
    amountError.value = validationResult === null ? undefined : validationResult

    nextTick(() => {
      amount.value = useCurrencyValue(newVal)
    })
  })

  watch(
    () => itemsRef.value?.bankAccounts?.data,
    newAccounts => {
      if (newAccounts?.length && !selected.value) {
        selected.value = newAccounts[0]
      }
    },
    { immediate: true }
  )

  // Methods
  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const setAmount = () => {
    amount.value = availableBalance.value.toString()
  }

  const validateWithdrawAmount = (): boolean => {
    const receipt = realAmount.value - fee.value

    if (receipt < MIN_WITHDRAW_AMOUNT) {
      showAlert({
        text: t('alert.minWithdrawTomanError'),
        color: 'error',
      })
      return false
    }

    if (receipt > MAX_WITHDRAW_AMOUNT) {
      showAlert({
        text: t('alert.maxWithdrawTomanError'),
        color: 'error',
      })
      return false
    }

    if (!selected.value) {
      showAlert({
        text: t('alert.selectBankAccount'),
        color: 'error',
      })
      return false
    }

    return true
  }

  const create = async () => {
    if (!validateWithdrawAmount()) {
      return
    }

    isLoading.value = true
    try {
      const body = {
        amount: realAmount.value,
        bankAccount: selected.value!._id,
        coin: 'IRT',
      }

      const data: any = await api.post('/api/v1/wallet/withdraw', body)
      walletId.value = data.walletId
      amount.value = '0'
      openModal()
    } catch (error) {
      console.error('Withdraw creation failed:', error)
      showAlert({
        text: t('alert.withdrawFailed'),
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  const verify = async (code: string) => {
    isLoading.value = true
    try {
      const body = {
        walletId: walletId.value,
        code,
      }
      await api.post('/api/v1/wallet/verify-withdraw', body)
      closeModal()
      showAlert({
        text: t('alert.withdrawSuccessfull'),
        color: 'success',
      })
      router.push('/dashboard/wallet')
    } catch (error) {
      console.error('Verification failed:', error)
      showAlert({
        text: t('alert.verificationFailed'),
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    selected,
    amount,
    amountError,
    isLoading,
    isOpen,
    // Computed
    realAmount,
    fee,
    irtWallet,
    availableBalance,
    receiptAmount,
    // Methods
    setAmount,
    create,
    verify,
    openModal,
    closeModal,
  }
}

// ==================== Crypto Withdrawal ====================

interface Network {
  _id: string
  slug: string
  isWithdraw: boolean
  withdrawFee: number
  minWithdraw: number
  numberOfDecimal: number
  destinationTag: boolean
  [key: string]: any
}

interface Symbol {
  _id: string
  symbol: string
  networks: Network[]
  [key: string]: any
}

interface CryptoWithdrawItems {
  wallets?: Wallet[]
  symbols?: Symbol[]
}

export function useWithdrawCrypto(itemsRef: Ref<CryptoWithdrawItems>) {
  const { t } = useI18n()
  const router = useRouter()
  const { showAlert } = useAlertStore()
  const api = useApi()

  // State
  const symbol = ref<Symbol | undefined>()
  const selected = ref<Network | undefined>()
  const amount = ref('')
  const amountError = ref<string | undefined>(undefined)
  const isLoading = ref(false)
  const isOpen = ref(false)
  const walletId = ref('')
  const address = ref('')
  const memo = ref('')

  // Computed
  const realAmount = computed(() => {
    return +useTrimNumber(amount.value?.replace(/,/gi, '')) || 0
  })

  const usdtWallet = computed(() => {
    if (!itemsRef.value?.wallets) {
      return {
        totalUSDT: 0,
        totalBlockedUSDT: 0,
      }
    }

    const wallet = itemsRef.value.wallets.find(item => item.coin === 'USDT')
    return wallet || { totalUSDT: 0, totalBlockedUSDT: 0 }
  })

  const availableBalance = computed(() => {
    return (usdtWallet.value.totalUSDT || 0) - (usdtWallet.value.totalBlockedUSDT || 0)
  })

  const receiptAmount = computed(() => {
    if (!selected.value) return 0
    const receipt = realAmount.value - selected.value.withdrawFee
    return receipt > 0 ? receipt : 0
  })

  // Watchers
  watch(
    () => itemsRef.value,
    newVal => {
      if (newVal?.symbols) {
        symbol.value = newVal.symbols.find(item => item.symbol === 'USDT')
        selected.value = symbol.value?.networks[0]
      }
    },
    { immediate: true }
  )

  watch(amount, newVal => {
    const validationResult = useValidate(newVal, 'amount')
    amountError.value = validationResult === null ? undefined : validationResult

    nextTick(() => {
      amount.value = useCurrencyValue(newVal)
    })
  })

  // Methods
  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const setAmount = () => {
    amount.value = availableBalance.value.toString()
  }

  const validateWithdraw = (): boolean => {
    if (!selected.value) {
      showAlert({
        text: t('alert.selectNetwork'),
        color: 'error',
      })
      return false
    }
    const checkAddress = useAddressChecker(address.value, selected.value.slug)
    if (!checkAddress) {
      showAlert({
        text: t('alert.formatNotCorrect'),
        color: 'error',
      })
      return false
    }

    const minAmount = selected.value.minWithdraw + selected.value.withdrawFee
    if (realAmount.value - selected.value.withdrawFee < selected.value.minWithdraw) {
      showAlert({
        text: `حداقل مبلغ برداشت ارزی ${minAmount} می باشد.`,
        color: 'error',
      })
      return false
    }

    if (!address.value) {
      showAlert({
        text: t('alert.enterAddress'),
        color: 'error',
      })
      return false
    }

    return true
  }

  const create = async () => {
    if (!validateWithdraw()) {
      return
    }

    isLoading.value = true
    try {
      const body = {
        amount: realAmount.value,
        coin: 'USDT',
        // symbol: symbol.value!._id,
        destinationTag: memo.value,
        address: address.value,
        network: selected.value!._id,
      }

      const data: any = await api.post('/api/v1/wallet/withdraw', body)
      walletId.value = data.walletId
      amount.value = '0'
      openModal()
    } catch (error) {
      console.error('Withdraw creation failed:', error)
      showAlert({
        text: t('alert.withdrawFailed'),
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  const verify = async (code: string) => {
    isLoading.value = true
    try {
      const body = {
        walletId: walletId.value,
        code,
      }

      await api.post('/api/v1/wallet/verify-withdraw', body)
      closeModal()
      showAlert({
        text: t('alert.withdrawSuccessfull'),
        color: 'success',
      })
      router.push('/dashboard/wallet')
    } catch (error: any) {
      console.error('Verification failed:', error)
      const errorMessage = error.data?.message?.[0] || t('alert.serverError')
      showAlert({
        text: errorMessage,
        color: 'error',
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    symbol,
    selected,
    amount,
    amountError,
    isLoading,
    isOpen,
    address,
    memo,
    // Computed
    usdtWallet,
    availableBalance,
    receiptAmount,
    // Methods
    setAmount,
    create,
    verify,
    openModal,
  }
}
