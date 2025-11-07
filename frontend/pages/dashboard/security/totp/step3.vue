<script setup lang="ts">
const { site } = await useSiteInfo()
const localePath = useLocalePath()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'گام چهارم',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام چهارم`,
  ogTitle: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام چهارم`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="container mx-auto">
    <CoreStep :step="4" />
    <div class="mt-8 w-full flex flex-col justify-center items-center space-y-4">
      <div><span class="text-blue-400">'گام چهارم': </span>{{ $t('activation') }}</div>
      <div>شناسایی دوعاملی برای حساب شما با موفقیت فعال شد.</div>
      <div class="flex justify-center items-center pb-4">
        از این پس برای ورود به سامانه حتما باید اپلیکیشن Google Authenticator را روی گوشی خود را در
        اختیار داشته باشید و کد ایجاد شده را وارد نمایید.
      </div>
      <CoreBtnDefault @click="navigateTo(localePath('/dashboard/security'))"> ادامه </CoreBtnDefault>
    </div>
  </div>
</template>
