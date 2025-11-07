<script lang="ts" setup>
import { useOverlayStore } from '~/stores/overlay'

const { toggleOverlay } = useOverlayStore()
const api = useApi()
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'واریز ارزی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | واریز ارزی`,
  ogTitle: `صرافی ${site.value?.siteName} | واریز ارزی`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const items: any = ref([])

onBeforeMount(() => {
  getData()
})

const getData = async () => {
  try {
    toggleOverlay(true)
    const data: any = await api.get(`/api/v1/transaction`)
    items.value = data
  } finally {
    toggleOverlay(false)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CoreCardDefault class="p-2 lg:p-6">
        <CoreInputTabDeposit currentTab="crypto" />
        <FormDepositCoin v-show="items.symbols" :items="items" />
      </CoreCardDefault>

      <CoreCardDefault class="p-2 lg:p-6 flex flex-col gap-2 md:gap-6">
        <div class="flex">
          <BaseIcon name="info" className="w-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.crypto.alert1') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon name="info" className="w-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.crypto.alert2') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon name="info" className="w-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.crypto.alert3') }}
            {{ $t(site?.siteName) }}
            {{ $t('depositPage.crypto.alert31') }}
          </span>
        </div>
      </CoreCardDefault>
    </div>
  </div>
</template>
