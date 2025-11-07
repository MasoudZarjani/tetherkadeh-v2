<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import { useOverlayStore } from '~/stores/overlay'
import { useAuth } from '@/composables/useAuth'

const { t } = useI18n()
const { user, getProfile } = useAuth()
const { showAlert } = useAlertStore()
const { toggleOverlay } = useOverlayStore()
const api = useApi()
const { site } = await useSiteInfo()
const localePath = useLocalePath()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'امنیت',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | امنیت`,
  ogTitle: `صرافی ${site.value?.siteName} | امنیت`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const updateUser = async () => {
  try {
    toggleOverlay(true)
    await api.put('/api/v1/user', { twoStepVerification: false })
    showAlert({ text: t('alert.disableTwoAuth'), color: 'success' })
    await getProfile()
  } finally {
    toggleOverlay(false)
  }
}
</script>
<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreCardDefault class="p-2 lg:p-6 flex flex-col lg:flex-row justify-between items-center">
      <div
        class="flex flex-col md:flex-row text-center md:text-right justify-center items-center space-y-4"
      >
        <BaseIcon name="totp" class="fill-black dark:fill-white" />
        <div class="flex flex-col mx-2 my-2 md:my-0 gap-2">
          <div class="text-xs lg:text-base font-semibold">
            {{ $t('twoFactor') }} (Google Authenticator)
          </div>
          <div class="text-xs lg:text-sm font-medium text-gray-400">
            {{ $t('twoFactorSubtitle') }}
          </div>
        </div>
      </div>
      <CoreBtnDefault
        @click="navigateTo(localePath('/dashboard/security/totp'))"
        v-if="!user?.twoFactorVerification"
        >{{ $t('activation') }}</CoreBtnDefault
      >
      <CoreBtnError @click="updateUser()" v-else> {{ $t('deactivation') }} </CoreBtnError>
    </CoreCardDefault>
    <CoreCardDefault
      class="p-2 lg:p-6 flex flex-col lg:flex-row justify-between items-center mt-2 md:mt-4"
    >
      <div
        class="flex flex-col md:flex-row text-center md:text-right justify-center items-center space-y-4"
      >
        <BaseIcon name="password" class="fill-black dark:fill-white" />
        <div class="flex flex-col mx-2 my-2 md:my-0 gap-2">
          <div class="text-xs lg:text-base font-semibold">{{ $t('accountPassword') }}</div>
          <div class="font-medium text-xs lg:text-sm text-gray-400">
            {{ $t('accountPasswordSubtitle') }}
          </div>
        </div>
      </div>
      <CoreBtnDefault @click="navigateTo(localePath('/dashboard/profile'))">{{
        $t('changePassword')
      }}</CoreBtnDefault>
    </CoreCardDefault>
  </div>
</template>
