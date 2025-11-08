<script setup lang="ts">
const { locale } = useI18n()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

// SEO Meta Tags
useSeoMeta({
  title: () =>
    `${site.value?.siteName} | خرید تتر ارزان و سریع | بهترین صرافی خرید و فروش تتر (USDT)`,
  ogTitle: () =>
    `${site.value?.siteName} | خرید تتر ارزان و سریع | بهترین صرافی خرید و فروش تتر (USDT)`,
  description: () =>
    `خرید تتر ارزان و سریع با بهترین قیمت تتر امروز در ${site.value?.siteName}. خرید و فروش تتر با ریال، پشتیبانی 24 ساعته، کارمزد پایین و تسویه فوری. همین حالا در ${site.value?.siteName} ثبت‌نام کنید!`,
  ogDescription: () =>
    `خرید تتر ارزان و سریع با بهترین قیمت تتر امروز در ${site.value?.siteName}. خرید و فروش تتر با ریال، پشتیبانی 24 ساعته، کارمزد پایین و تسویه فوری. همین حالا در ${site.value?.siteName} ثبت‌نام کنید!`,
  ogImage: 'https://tetherkade.com/logo.png',
  ogUrl: 'https://tetherkade.com',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${site.value?.siteName} | خرید و فروش امن ارز دیجیتال`,
  twitterDescription: () =>
    `خرید و فروش سریع تتر و رمزارز با امنیت بالا و کارمزد پایین در صرافی ${site.value?.siteName}. شروع آسان معاملات رمز ارز.`,
})

// Canonical Link with locale support
const canonicalUrl = computed(() => {
  const baseUrl = 'https://tetherkade.com'
  return locale.value === 'fa' ? baseUrl : `${baseUrl}/${locale.value}`
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
})
// Structured Data with useSchemaOrg
useSchemaOrg([
  // CryptocurrencyExchange Schema
  defineOrganization({
    '@type': 'CryptocurrencyExchange',
    name: site.value?.siteName,
    url: 'https://tetherkade.com',
    logo: 'https://tetherkade.com/logo.png',
    image: 'https://tetherkade.com/logo.png',
    description: `خرید تتر ارزان و سریع با بهترین قیمت تتر امروز در ${site.value?.siteName}. خرید و فروش تتر با ریال، پشتیبانی 24 ساعته، کارمزد پایین و تسویه فوری.`,
    sameAs: [
      'https://www.instagram.com/tetherkade',
      'https://t.me/tetherkade',
      'https://www.linkedin.com/company/tetherkade',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'بلوار وکیل آباد',
      addressLocality: 'مشهد',
      addressRegion: 'خراسان رضوی',
      addressCountry: 'IR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.value?.phone,
      contactType: 'customer support',
      email: site.value?.email,
      areaServed: 'IR',
      availableLanguage: ['fa'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    },
  }),

  // FAQ Schema
  {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `آیا خرید تتر در ${site.value?.siteName} قانونی است؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `بله، خرید و فروش تتر و سایر ارزهای دیجیتال در ایران به‌صورت آزاد انجام می‌شود. ${site.value?.siteName} به عنوان یک صرافی معتبر بستری امن برای شما فراهم کرده است.`,
        },
      },
      {
        '@type': 'Question',
        name: `بهترین شبکه برای انتقال تتر در ${site.value?.siteName} کدام است؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `شبکه TRC-20 (ترون) به دلیل کارمزد پایین، محبوب‌ترین گزینه در ${site.value?.siteName} برای کاربران ایرانی است.`,
        },
      },
      {
        '@type': 'Question',
        name: `چگونه می‌توانم در ${site.value?.siteName} تتر را به ریال بفروشم؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `به راحتی وارد حساب کاربری ${site.value?.siteName} شوید، مقدار مورد نظر را انتخاب کنید و معادل ریالی آن به صورت فوری به حساب بانکی شما واریز می‌شود.`,
        },
      },
      {
        '@type': 'Question',
        name: `حداقل مقدار خرید تتر در ${site.value?.siteName} چقدر است؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `شما می‌توانید حتی با مبالغ کم نیز در ${site.value?.siteName} اقدام به خرید تتر کنید؛ این موضوع خرید را برای همه کاربران ساده کرده است.`,
        },
      },
    ],
  },
])

onMounted(() => {
  getData()
})
// Fetch data
const { isLoading, items, getData } = await useSymbolFetch()

</script>

<template>
  <CoreDialogAnnouncement v-if="locale === 'fa'">
    <div class="text-2xl">اطلاعیه📣</div>
    <p class="my-2">
      کاربر گرامی، نظر به شرایط جنگی و تحریمی موجود، به اطلاع می‌رسد که نگهداری تتر (USDT) در کیف
      پول‌ها خطر فریز شدن دارایی را به‌طور جدی افزایش می‌دهد. لذا اکیداً توصیه می‌شود تتر موجود خود
      را به سایر ارزها تبدیل کرده و سپس نگهداری فرمایید.
    </p>
  </CoreDialogAnnouncement>
  <GeneralBanner :symbol="items" v-if="!isLoading" />
  <GeneralFeaturesSection />
  <GeneralHowSection />
  <GeneralFaqSection />
  <GeneralDocumentSection />
</template>
