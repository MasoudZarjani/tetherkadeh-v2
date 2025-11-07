<script setup lang="ts">
import { useOverlayStore } from '~/stores/overlay'

const { toggleOverlay } = useOverlayStore()
const api = useApi()
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'برداشت ریالی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | برداشت ریالی`,
  ogTitle: `صرافی ${site.value?.siteName} | برداشت ریالی`,
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
  <div class="container mx-auto px-2 lg:px-8 py-2 lg:py-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CoreCardDefault class="p-2 lg:p-6">
        <CoreInputTabWithdraw currentTab="bank" />
        <WalletWithdrawBank v-show="items.bankAccounts" :items="items" />
      </CoreCardDefault>
      <CoreCardDefault class="p-2 lg:p-6 flex flex-col gap-2 md:gap-6">
        <div class="flex">
          <BaseIcon name="info" className="w-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('withdrawPage.bank.alert1') }}
            <span class="text-blue-400 underline">{{ $t(site?.siteName) }}</span>
            {{ $t('withdrawPage.bank.alert11') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon name="info" className="w-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('withdrawPage.bank.alert2') }}
          </span>
        </div>
        <div class="flex mt-2">
          <BaseIcon name="alert" className="w-6" />
          <span class="font-bold text-blue-400 mx-2">
            {{ $t('withdrawPage.bank.alert3') }}
          </span>
        </div>
      </CoreCardDefault>
    </div>
  </div>
</template>
