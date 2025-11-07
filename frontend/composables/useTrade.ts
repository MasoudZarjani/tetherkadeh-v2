export async function useTrade() {
  const api = useApi()

  const loading = ref(false)
  const orders = ref([])
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const headers = ref(['symbol', 'amount', 'price', 'trackId', 'side', 'createdAt'])
  const search = ref<string>('')

  const getData = async () => {
    loading.value = true
    try {
      const data: any = await api.get(
        `/api/v1/order?page=${page.value}&limit=${limit.value}&sort=createdAt&order=-1&search=${search.value}`
      )
      orders.value = data.data
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const changePage = async (newPage: number) => {
    page.value = newPage
    await getData()
  }

  const onInput = (e: any) => {
    search.value = e.target.value
    getData()
  }

  return {
    headers,
    orders,
    total,
    page,
    limit,
    loading,
    search,
    changePage,
    onInput,
    getData,
  }
}
