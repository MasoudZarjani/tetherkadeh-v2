import { useOverlayStore } from '~/stores/overlay'
import { useAuth } from '@/composables/useAuth'

// Types
interface Wallet {
  coin: string
  totalUSDT: number
  totalIRT: number
  totalBlockedUSDT: number
  totalBlockedIRT: number
}

interface Symbol {
  last: number
  buyingPriceGap: number
  buyingPriceGapPercentage: number
}

interface PriceData {
  pctChange: number
  openPrice: number
}

interface DashboardData {
  symbols?: Symbol[]
  wallets?: Wallet[]
  orders?: any[]
  priceData?: PriceData
  orderCount?: number
  depositCount?: number
  withdrawalCount?: number
}

const EMPTY_WALLET: Wallet = {
  coin: '',
  totalUSDT: 0,
  totalIRT: 0,
  totalBlockedUSDT: 0,
  totalBlockedIRT: 0,
}

export async function useDashboardData() {
  const { user } = useAuth()
  const { toggleOverlay } = useOverlayStore()
  const api = useApi()

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const items = ref<DashboardData>({})

  // Basic Computed
  const headers = computed(() => ['symbol', 'amount', 'side', 'createdAt'])
  const orders = computed(() => items.value?.orders || [])
  const priceData = computed(() => items.value?.priceData)

  // Wallet Computed
  const irtWallet = computed(() => getWallet('IRT'))
  const usdtWallet = computed(() => getWallet('USDT'))

  // Symbol Computed
  const primarySymbol = computed(() => items.value.symbols?.[0])
  const hasSymbols = computed(() => !!items.value.symbols?.length)

  const lastBuyPrice = computed(() => {
    const sym = primarySymbol.value
    if (!sym) return 0
    return (sym.last + sym.buyingPriceGap) * (1 + sym.buyingPriceGapPercentage / 100)
  })

  // Balance Computed (Available = Total - Blocked)
  const availableIRT = computed(
    () => (irtWallet.value?.totalIRT || 0) - (irtWallet.value?.totalBlockedIRT || 0)
  )

  const availableUSDT = computed(
    () => (usdtWallet.value?.totalUSDT || 0) - (usdtWallet.value?.totalBlockedUSDT || 0)
  )

  // Total Assets Computed
  const totalAssetsIRT = computed(
    () => (usdtWallet.value?.totalIRT || 0) + (irtWallet.value?.totalIRT || 0)
  )

  const totalAssetsUSDT = computed(
    () => (usdtWallet.value?.totalUSDT || 0) + (irtWallet.value?.totalUSDT || 0)
  )

  // Methods
  const getWallet = (type: string): Wallet => {
    const wallet = items.value?.wallets?.find(w => w.coin === type)
    return wallet || { ...EMPTY_WALLET, coin: type }
  }

  const getDashboardData = async () => {
    try {
      isLoading.value = true
      error.value = null
      toggleOverlay(true)

      const data = await api.get<DashboardData>('/api/v1/dashboard')
      items.value = data
    } finally {
      isLoading.value = false
      toggleOverlay(false)
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    user,
    items: readonly(items),

    // Basic Computed
    headers,
    orders,
    priceData,

    // Wallet Computed
    irtWallet,
    usdtWallet,

    // Symbol Computed
    primarySymbol,
    hasSymbols,
    lastBuyPrice,

    // Balance Computed
    availableIRT,
    availableUSDT,

    // Total Assets Computed
    totalAssetsIRT,
    totalAssetsUSDT,

    // Methods
    getDashboardData,
  }
}
