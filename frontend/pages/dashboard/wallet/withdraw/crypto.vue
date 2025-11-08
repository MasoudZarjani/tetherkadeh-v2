<script lang="ts" setup>
import { useOverlayStore } from '~/stores/overlay'

const { toggleOverlay } = useOverlayStore()
const api = useApi()
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'برداشت رمز ارزی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | برداشت رمز ارزی`,
  ogTitle: `صرافی ${site.value?.siteName} | برداشت رمز ارزی`,
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
        <CoreInputTabWithdraw currentTab="crypto" />
        <WalletWithdrawCrypto v-show="items.symbols" :items="items" />
      </CoreCardDefault>
      <CoreCardDefault class="p-2 lg:p-6 flex flex-col gap-2 md:gap-6">
        <div class="flex">
          <BaseIcon className="w-6" name="info" />
          <span class="font-bold text-blue-500 mr-2">
            {{ $t('withdrawPage.crypto.alert1') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon className="w-6" name="info" />
          <span class="font-bold text-blue-500 mr-2">
            {{ $t('withdrawPage.crypto.alert2') }}
          </span>
        </div>
        <div class="flex mt-2">
          <BaseIcon className="w-6" name="info" />
          <span class="font-bold text-blue-500 mr-2">
            {{ $t('withdrawPage.crypto.alert3') }}
            <span class="text-blue-400 underline">{{ $t(site?.siteName) }}</span>
            {{ $t('withdrawPage.crypto.alert31') }}
          </span>
        </div>
      </CoreCardDefault>
    </div>
  </div>
</template>
