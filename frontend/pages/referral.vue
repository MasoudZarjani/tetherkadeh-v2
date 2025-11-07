<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | دعوت از دوستان`,
  ogTitle: `صرافی ${site.value?.siteName} | دعوت از دوستان`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://tetherkade.com' + route.path }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `دعوت از دوستان | ${site.value?.siteName}`,
        url: 'https://tetherkade.com' + route.path,
        description: `با دعوت از دوستان خود در ${site.value?.siteName}، هدیه دریافت کنید.`,
        publisher: {
          '@type': 'Organization',
          name: `${site.value?.siteName}`,
          url: 'https://tetherkade.com',
          logo: 'https://tetherkade.com/logo.png',
        },
      }),
    },
  ],
})
</script>
<template>
  <div class="container h-full mx-auto my-8 md:my-16 lg:my-24 xl:my-32 p-2 md:p-0">
    <h1 class="text-4xl font-semibold mt-2">🎁 {{ $t('referralPage.title1') }}!</h1>
    <h2 class="text-2xl font-semibold mt-2">{{ $t('referralPage.title2') }}!</h2>
    <p class="mt-2">
      {{ $t('referralPage.body') }}
    </p>
  </div>
</template>
