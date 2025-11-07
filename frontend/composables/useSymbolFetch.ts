export const useSymbolFetch = async () => {
  const { toggleOverlay } = useOverlayStore()
  const api = useApi()
  const isLoading = ref(false)
  const items: any = ref([])

  const getData = async () => {
    try {
      isLoading.value = true
      toggleOverlay(true)
      const data: any = await api.get('/api/v1/symbol')
      items.value = data[0]
    } finally {
      isLoading.value = false
      toggleOverlay(false)
    }
  }

  return {
    isLoading,
    items,
    getData,
  }
}
