<script setup lang="ts">
const { isLoading, errorMessage, confirm, sendAgain } = useConfirmCode()
const { site } = await useSiteInfo()
const route = useRoute()
const { t } = useI18n()

definePageMeta({
  public: true,
  layout: 'auth',
  redirectifAuthenticated: true,
})

const siteTitle = computed(() => t(site.value?.siteName || 'tetherkade') || 'تترکده')

useHead({
  link: [{ rel: 'canonical', href: `https://tetherkade.com${route.path}` }],
})

useSeoMeta({
  title: `صرافی ${siteTitle.value} | کد تایید`,
  ogTitle: `صرافی ${siteTitle.value} | کد تایید`,
  description: `صرافی ${siteTitle.value} | کد تایید تکمیل ثبت نام`,
  ogDescription: `صرافی ${siteTitle.value} | کد تایید تکمیل ثبت نام`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex justify-center items-center lg:hidden mb-4">
        <NuxtLink
          :prefetch="false"
          :to="$localePath('/')"
          class="inline-block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
          :aria-label="$t('goToHomePage')"
        >
          <CoreLogo class="w-10 h-10" />
        </NuxtLink>
      </div>

      <h1 class="font-semibold text-lg lg:text-2xl text-gray-800 dark:text-gray-100">
        {{ $t('loginTo') }}
        <span class="text-blue-400">{{ siteTitle }}</span>
      </h1>

      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ $t('enterConfirmationCode') }}
      </p>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      role="alert"
    >
      <p class="text-sm text-red-600 dark:text-red-400">
        {{ errorMessage }}
      </p>
    </div>

    <!-- SMS Input Component -->
    <CoreInputSMS
      :isLoading="isLoading"
      @sendAgain="sendAgain"
      @completed="confirm"
      class="mt-4 lg:mt-8"
    />

    <!-- Back to Login -->
    <div class="mt-6 text-center">
      <NuxtLink
        :to="$localePath('/auth/login')"
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
      >
        {{ $t('backToLogin') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
