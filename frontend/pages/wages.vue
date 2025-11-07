<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | کارمزد ها`,
  ogTitle: `صرافی ${site.value?.siteName} | کارمزد ها`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://tetherkade.com' + route.path }],
})
</script>
<template></template>
