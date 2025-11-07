<script lang="ts" setup>
const { site } = await useSiteInfo()
const localePath = useLocalePath()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'نتیجه پرداخت',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | نتیجه پرداخت`,
  ogTitle: `صرافی ${site.value?.siteName} | نتیجه پرداخت`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <div class="relative px-2 lg:px-8 md:px-0">
      <div class="container mx-auto max-w-xl w-full relative z-10 text-center">
        <CoreCardDefault
          class="p-2 lg:p-6"
          :class="
            $route.query.success && $route.query.success === 'true'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          "
        >
          <div v-if="$route.query.success && $route.query.success === 'true'">
            {{ $t('alert.successPayment') }}
          </div>
          <div v-else>
            {{ $t('alert.failedPayment') }}
          </div>
        </CoreCardDefault>
        <CoreBtnDefault class="mt-2" @click="navigateTo(localePath('/dashboard/wallet'))">
          رفتن به کیف پول
        </CoreBtnDefault>
      </div>
    </div>
  </div>
</template>
