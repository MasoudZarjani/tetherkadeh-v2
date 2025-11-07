<script setup lang="ts">
import { faqList as rawFaqs } from '~/constants/faqs'

const { locale } = useI18n()

const faqList = ref(rawFaqs.slice(0, 5).map(faq => ({ ...faq, active: false })))

const toggleAccordion = (item: any) => {
  item.active = !item.active
  faqList.value.forEach(faq => {
    if (faq !== item) faq.active = false
  })
}
</script>
<template>
  <section class="flex flex-col min-h-96 w-full px-4 py-4 md:px-8 md:py-10 max-w-6xl mx-auto">
    <div class="col-span-2 flex w-full flex-col items-center justify-center">
      <div class="mb-2 flex w-full items-center justify-between">
        <h3 class="font-semibold md:text-base">{{ $t('faq') }}</h3>
        <nuxt-link
          :to="$localePath('/faq')"
          class="flex items-center justify-center font-semibold text-blue-400 md:text-base"
        >
          <span>{{ $t('viewMore') }}</span>
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
    </div>
    <div class="bg-slate-200 dark:bg-slate-700 flex flex-col gap-px" id="accordion">
      <GeneralFaqAccordion :faqs="faqList" @toggle="toggleAccordion" />
    </div>
  </section>
</template>
