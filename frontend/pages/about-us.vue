<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

// Computed values for SEO
const pageTitle = computed(() => `صرافی ${site.value?.siteName} | درباره ${site.value?.siteName}`)
const pageDescription = computed(
  () =>
    `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`
)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `https://tetherkade.com${route.path}` }],
})

useSchemaOrg([
  defineOrganization({
    name: site.value?.siteName,
    url: 'https://tetherkade.com',
    logo: 'https://tetherkade.com/logo.png',
    description: `${site.value?.siteName}، صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته.`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.value?.phone,
        contactType: 'customer support',
        email: site.value?.email,
        areaServed: 'IR',
        availableLanguage: ['fa'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/tetherkade',
      'https://t.me/tetherkade',
      'https://www.linkedin.com/company/tetherkade',
    ],
  }),
  defineWebPage({
    name: `درباره ${site.value?.siteName}`,
    description: `${site.value?.siteName}، پلی امن به آینده‌ی مالی شما. ماموریت، اهداف و خدمات صرافی ${site.value?.siteName}.`,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: 'https://tetherkade.com' },
      { name: 'درباره ما', item: 'https://tetherkade.com/about' },
    ],
  }),
])

// Features data
const features = [
  {
    key: 'fast',
    titleKey: 'aboutPage.fast',
    descKey: 'aboutPage.p5',
  },
  {
    key: 'wage',
    titleKey: 'aboutPage.wage',
    descKey: 'aboutPage.p6',
  },
  {
    key: 'ui',
    titleKey: 'aboutPage.ui',
    descKey: 'aboutPage.p7',
  },
  {
    key: 'kyc',
    titleKey: 'aboutPage.kyc',
    descKey: 'aboutPage.p8',
  },
  {
    key: 'persianSupport',
    titleKey: 'aboutPage.persianSupport',
    descKey: 'aboutPage.p9',
  },
  {
    key: 'license',
    titleKey: 'aboutPage.license',
    descKey: 'aboutPage.p10',
  },
]

// Highlights data
const highlights = [
  { color: '#155dfc', labelKey: 'aboutPage.security' },
  { color: 'bg-green-500', labelKey: 'aboutPage.support' },
  { color: 'bg-blue-500', labelKey: 'aboutPage.transaction' },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-pattern py-16 sm:py-24">
      <div class="container mx-auto px-4 text-center">
        <div class="fade-in">
          <h1 class="text-3xl sm:text-5xl font-bold">
            {{ $t('aboutPage.aboutExchange') }}
            <span class="text-blue-400">{{ $t(site?.siteName) }}</span>
          </h1>
          <p
            class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mt-4"
          >
            {{ $t(site?.siteName) }}{{ $t('aboutPage.slogan') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Mission Content -->
          <div class="slide-up">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {{ $t('aboutPage.mission') }}
            </h2>

            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 text-justify">
              {{ $t('aboutPage.p1') }}
            </p>

            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 text-justify">
              {{ $t(site?.siteName) }} {{ $t('aboutPage.p2') }}
            </p>

            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 text-justify">
              {{ $t('aboutPage.p3') }}
            </p>

            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 text-justify">
              {{ $t('aboutPage.p4') }}{{ $t(site?.siteName) }}{{ $t('aboutPage.p44') }}
            </p>

            <!-- Highlights -->
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(highlight, index) in highlights"
                :key="index"
                class="flex items-center space-x-2 space-x-reverse"
              >
                <span
                  class="w-3 h-3 rounded-full mx-2"
                  :class="highlight.color.startsWith('bg-') ? highlight.color : ''"
                  :style="
                    !highlight.color.startsWith('bg-') ? { backgroundColor: highlight.color } : {}
                  "
                />
                <span class="text-gray-700 dark:text-gray-300">
                  {{ $t(highlight.labelKey) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Info Card -->
          <div class="slide-up">
            <div class="bg-white dark:bg-gray-800 rounded-2xl card-shadow p-8">
              <div class="text-center mb-8">
                <div
                  class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 bg-blue-300/20"
                >
                  <core-logo />
                </div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                  {{ $t(site?.siteName) }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t('aboutPage.established') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {{ $t('aboutPage.whyExchange') }}
            <span class="text-blue-400">{{ $t(site?.siteName) }}</span>
            ؟
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="flex items-start space-x-4 space-x-reverse"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-300/20"
            >
              <span class="text-xl font-bold" style="color: #155dfc">✓</span>
            </div>
            <div class="mx-2">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {{ $t(feature.titleKey) }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ $t(feature.descKey) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
