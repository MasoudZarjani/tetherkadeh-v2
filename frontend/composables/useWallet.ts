import { useOverlayStore } from '~/stores/overlay'

export const useWallet = () => {
  const api = useApi()
  const { toggleOverlay } = useOverlayStore()
  const items = ref<any[]>([])
  const loading = ref(false)

  onBeforeMount(async () => {
    await fetchWallet()
  })

  const fetchWallet = async () => {
    toggleOverlay(true)
    loading.value = true
    try {
      const res: any = await api.get('/api/v1/wallet/inventory')
      items.value = res.data
    } finally {
      toggleOverlay(false)
      loading.value = false
    }
  }

  const irtWallet = computed(
    () =>
      items.value.find(item => item.coin === 'IRT') ?? {
        totalDepositIRT: 0,
        totalBlockedIRT: 0,
        totalIRT: 0,
        totalWithdrawIRT: 0,
        totalDepositUSDT: 0,
      }
  )

  const usdtWallet = computed(
    () =>
      items.value.find(item => item.coin === 'USDT') ?? {
        totalDepositUSDT: 0,
        totalBlockedUSDT: 0,
        totalUSDT: 0,
        totalWithdrawUSDT: 0,
        totalDepositIRT: 0,
      }
  )

  return {
    loading,
    irtWallet,
    usdtWallet,
  }
}
