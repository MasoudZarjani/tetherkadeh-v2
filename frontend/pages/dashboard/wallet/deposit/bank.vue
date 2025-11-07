<script lang="ts" setup>
import { useOverlayStore } from '~/stores/overlay'
import { useAlertStore } from '~/stores/alert'

const { showAlert } = useAlertStore()
const { toggleOverlay } = useOverlayStore()
const { t } = useI18n()
const { site } = await useSiteInfo()
const api = useApi()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'واریز شتابی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${t(site.value?.siteName || '')} | واریز شتابی`,
  ogTitle: `صرافی ${t(site.value?.siteName || '')} | واریز شتابی`,
  description: `${t(site.value?.siteName || '')} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${t(site.value?.siteName || '')}.`,
  ogDescription: `${t(site.value?.siteName || '')} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${t(site.value?.siteName || '')}.`,
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

onMounted(() => {
  if (!site.value?.activeGateway) {
    showAlert({ text: t('alert.gatewayClosed'), color: 'error' })
    return
  }
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CoreCardDefault class="p-2 lg:p-6">
        <CoreInputTabDeposit currentTab="bank" :status="site?.activeGateway" />
        <FormDepositIrt v-show="items.bankAccounts" :items="items" />
      </CoreCardDefault>

      <CoreCardDefault class="p-2 lg:p-6 flex flex-col gap-2 md:gap-4">
        <div class="flex">
          <BaseIcon name="info" className="w-6 h-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.bank.alert1') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon name="info" className="w-6 h-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.bank.alert2') }}
            <span class="text-blue-400 underline">{{ $t(site?.siteName) }}</span>
            {{ $t('depositPage.bank.alert21') }}
          </span>
        </div>
        <div class="flex">
          <BaseIcon name="info" className="w-6 h-6" />
          <span class="font-bold text-blue-500 mx-2">
            {{ $t('depositPage.bank.alert3') }}
          </span>
        </div>
        <div class="flex mt-2">
          <BaseIcon name="alert" className="w-6 h-6" />
          <span class="font-bold text-blue-400 mx-2">
            {{ $t('depositPage.bank.alert4') }}
          </span>
        </div>
        <div class="my-1 flex justify-start items-center text-red-500" v-if="!site?.activeGateway">
          <span class="w-2 h-2 bg-red-500 mx-2 rounded-full"></span>
          {{ $t('disableGateway') }}
        </div>
      </CoreCardDefault>
    </div>
  </div>
</template>
