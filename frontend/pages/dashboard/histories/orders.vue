<script lang="ts" setup>
import { useOverlayStore } from '~/stores/overlay'

const { toggleOverlay } = useOverlayStore()
const api = useApi()
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'سفارشات',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | تاریخچه سفارشات`,
  ogTitle: `صرافی ${site.value?.siteName} | تاریخچه سفارشات`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const loading = ref(false)
const items = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const headers = ref(['symbol', 'amount', 'price', 'trackId', 'side', 'createdAt'])
const search = ref<string>('')

onBeforeMount(() => {
  getData()
})

const getData = async () => {
  toggleOverlay(true)
  loading.value = true
  try {
    const data: any = await api.get(
      `/api/v1/order?page=${page.value}&limit=${limit.value}&sort=createdAt&order=-1&search=${search.value}`
    )
    items.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
    toggleOverlay(false)
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
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreCardDefault class="lg:col-span-2 p-2 lg:p-6">
      <div class="flex flex-col lg:flex-row justify-between items-center mb-4 w-full">
        <div class="w-full md:w-1/3">
          <CoreInputSearch v-model="search" @input="onInput" width="w-full" />
        </div>
      </div>
      <TableHistoryOrder
        :headers="headers"
        :items="items"
        :total="total"
        :page="page"
        :limit="limit"
        :loading="loading"
        @change-page="changePage"
      />
    </CoreCardDefault>
  </div>
</template>
