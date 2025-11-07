export const useSymbolFetch = async () => {
  const config = useRuntimeConfig()
  const { data, pending, error, status } = await useLazyFetch<any>(
    `${config.public.baseURL}/api/v1/symbol`
  )
  const fallback = ref([{ symbol: 'USDT', price: 0 }]) // مقدار اولیه

  return {
    data: computed(() => data.value?.data || fallback.value),
    pending,
    error,
    status,
  }
}
