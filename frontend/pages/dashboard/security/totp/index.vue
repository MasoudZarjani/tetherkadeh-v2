<script setup lang="ts">
const { site } = await useSiteInfo()
const localePath = useLocalePath()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'گام اول',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام اول`,
  ogTitle: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام اول`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="container mx-auto">
    <CoreStep :step="1" />
    <div class="mt-8 w-full flex flex-col justify-center items-center space-y-4">
      <div>
        <span class="text-blue-400">{{ $t('step1') }}:</span>
        {{ $t('downloadApp') }}
      </div>
      <div>
        {{ $t('downloadAppSubtitle') }}
      </div>
      <div class="flex justify-center items-center pb-4">
        <a
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
          target="_blank"
          class="flex justify-center items-center rounded-xl border border-blue-400 p-1 mx-2"
        >
          <BaseIcon name="ios-download" className="fill-black dark:fill-white w-6" />
          <div class="px-2">{{ $t('downloadAppStore') }}</div>
        </a>
        <a
          href="https://apps.apple.com/us/app/google-authenticator/id388497605"
          target="_blank"
          class="flex justify-center items-center rounded-xl border border-blue-400 p-1 mx-2"
        >
          <BaseIcon name="google-download" className="fill-black dark:fill-white w-6" />
          <div class="px-2">{{ $t('downloadGooglePlay') }}</div>
        </a>
        <a
          href="https://cafebazaar.ir/app/com.google.android.apps.authenticator2?l=en"
          target="_blank"
          class="flex justify-center items-center rounded-xl border border-blue-400 p-1 mx-2"
        >
          <img src="/bazzar.png" alt="cafe bazzar logo" width="34px" />
          <div class="px-2">{{ $t('downloadCafeBazar') }}</div>
        </a>
      </div>
      <CoreBtnDefault @click="navigateTo(localePath('/dashboard/security/totp/step1'))">
        {{ $t('iInstalled') }}
      </CoreBtnDefault>
    </div>
  </div>
</template>
