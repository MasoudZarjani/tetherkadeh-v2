<script setup lang="ts">
import { faqList as rawFaqs } from '~/constants/faqs'

const route = useRoute()
const { site } = await useSiteInfo()
const { locale } = useI18n()

definePageMeta({
  public: true,
})

const pageTitle = computed(() => `صرافی ${site.value?.siteName} | سوالات متداول`)
const pageDescription = computed(
  () =>
    `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی.`
)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const faqList = ref(rawFaqs.map(faq => ({ ...faq, active: false })))

const faqSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      '@id': 'https://tetherkade.com/faq',
      name: `سوالات متداول ${site.value?.siteName}`,
      description: `پرسش و پاسخ‌های پرتکرار کاربران ${site.value?.siteName}`,
      url: 'https://tetherkade.com/faq',
      mainEntity: rawFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.text,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'خانه',
          item: 'https://tetherkade.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'سوالات متداول',
          item: 'https://tetherkade.com/faq',
        },
      ],
    },
  ],
}

useHead({
  link: [{ rel: 'canonical', href: 'https://tetherkade.com' + route.path }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema),
    },
  ],
})

const toggleAccordion = (item: any) => {
  item.active = !item.active
  faqList.value.forEach(faq => {
    if (faq !== item) faq.active = false
  })
}
</script>

<template>
  <section class="hero-pattern py-16 sm:py-20">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-6">
        {{ $t('faqList.title') }}
      </h1>
      <p
        class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        {{ $t('faqList.description') }}
      </p>
    </div>
  </section>

  <section class="flex flex-col min-h-96 w-full px-4 py-4 md:px-8 md:py-10 max-w-6xl mx-auto">
    <div class="mb-2 flex w-full items-center justify-between">
      <h3 class="font-semibold md:text-base">{{ $t('faq') }}</h3>
      <nuxt-link
        :to="$localePath('/faq')"
        class="flex items-center font-semibold text-blue-400 md:text-base"
      >
        {{ $t('viewMore') }}
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 mx-2 animate-ping"
          :class="locale === 'fa' ? 'rotate-0' : 'rotate-180'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </nuxt-link>
    </div>

    <div class="bg-slate-200 dark:bg-slate-700 flex flex-col gap-px" id="accordion">
      <GeneralFaqAccordion :faqs="faqList" @toggle="toggleAccordion" />
    </div>
  </section>
</template>
