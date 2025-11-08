<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

// SEO Meta
const pageTitle = computed(
  () => `تماس با ${site.value?.siteName} | پشتیبانی ۲۴ ساعته صرافی ارز دیجیتال`
)
const pageDescription = computed(
  () =>
    `تماس مستقیم با تیم پشتیبانی ${site.value?.siteName} از طریق تلفن، واتساپ، تلگرام و ایمیل. صرافی امن خرید و فروش تتر و ارزهای دیجیتال با کارمزد کم و احراز هویت سریع.`
)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: `تماس با پشتیبانی ۲۴ ساعته ${site.value?.siteName} برای خرید و فروش ارز دیجیتال. پاسخگویی سریع از طریق چندین کانال ارتباطی شامل واتساپ و تلگرام.`,
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
        contactType: 'پشتیبانی',
        email: site.value?.email,
        areaServed: 'IR',
        availableLanguage: ['Persian'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'بلوار وکیل آباد',
      addressLocality: 'مشهد',
      addressRegion: 'خراسان رضوی',
      addressCountry: 'IR',
    },
    sameAs: [
      'https://www.instagram.com/tetherkade',
      'https://t.me/tetherkade',
      'https://www.linkedin.com/company/tetherkade',
    ],
  }),
  defineWebPage({
    '@type': 'ContactPage',
    name: `تماس با ${site.value?.siteName}`,
    description: `صفحه تماس با تیم پشتیبانی ${site.value?.siteName}`,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'خانه', item: 'https://tetherkade.com' },
      { name: 'تماس با ما', item: 'https://tetherkade.com/contact' },
    ],
  }),
])

// Contact channels data
const contactChannels = [
  {
    id: 'phone',
    icon: 'phone',
    title: 'phoneCall',
    value: site.value?.mobile,
    link: `tel:${site.value?.mobile}`,
    linkText: 'تماس بگیرید',
    ariaLabel: 'آیکون تلفن',
  },
  {
    id: 'email',
    icon: 'email',
    title: 'email',
    value: site.value?.email,
    link: `mailto:${site.value?.email}`,
    linkText: 'ایمیل بفرستید',
    ariaLabel: 'آیکون ایمیل',
  },
  {
    id: 'telegram',
    icon: 'telegram',
    title: 'telegram',
    value: '@tetherkade',
    link: 'https://t.me/tetherkade',
    linkText: 'پیام دهید',
    ariaLabel: 'آیکون تلگرام',
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    title: 'whatsapp',
    value: site.value?.mobile,
    link: site.value?.whatsapp,
    linkText: 'چت کنید',
    ariaLabel: 'آیکون واتس اپ',
  },
]

// Office info data
const officeInfo = [
  {
    id: 'address',
    icon: 'location',
    title: 'address',
    content: [site.value?.address],
  },
  {
    id: 'hours',
    icon: 'clock',
    title: 'workingHours',
    content: ['شنبه تا پنج‌شنبه: 8:00 تا 20:00', 'جمعه: 10:00 تا 18:00'],
  },
  {
    id: 'support',
    icon: 'support',
    title: 'support',
    content: ['۲۴ ساعته، ۷ روز هفته'],
  },
]

// Form state
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  // TODO: Implement form submission logic
  console.log('Form submitted:', contactForm)
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-pattern py-16 sm:py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="fade-in">
          <h1 class="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            {{ $t('contactWay') }} {{ $t(site?.siteName) }}
          </h1>
          <p
            class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {{ $t('contactPage.p1') }}
          </p>
          <div class="mt-8">
            <div
              class="inline-flex items-center space-x-2 space-x-reverse bg-white dark:bg-gray-800 rounded-full px-6 py-3 card-shadow"
            >
              <div class="w-3 h-3 bg-green-500 rounded-full pulse-ring mx-1" />
              <span class="text-gray-700 dark:text-gray-300 font-medium">{{
                $t('contactPage.span')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Contact Channels -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div
            v-for="channel in contactChannels"
            :key="channel.id"
            class="contact-card bg-white dark:bg-gray-800 rounded-xl card-shadow p-6 text-center"
          >
            <div
              class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-blue-300/20"
            >
              <BaseIcon
                :name="channel.icon"
                class="w-8"
                fill="#0084FF"
                :aria-label="channel.ariaLabel"
              />
            </div>
            <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-2">
              {{ $t(channel.title) }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              {{ channel.value }}
            </p>
            <a
              :href="channel.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block text-sm px-4 py-2 rounded-lg transition-all cursor-pointer bg-blue-500 text-white hover:bg-blue-300/40"
            >
              {{ channel.linkText }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 bg-slate-50 dark:bg-slate-800">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="bg-slate-200 dark:bg-slate-700 p-6 rounded-lg">
            <h2 class="text-xl font-semibold mb-6">{{ $t('contactPage.form') }}</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <input
                v-model="contactForm.name"
                type="text"
                :placeholder="$t('nameAndFamily')"
                required
                class="w-full rounded-lg py-3 px-4 text-sm outline-0 bg-slate-300 dark:bg-slate-600 focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <input
                v-model="contactForm.email"
                type="email"
                :placeholder="$t('email')"
                required
                class="w-full rounded-lg py-3 px-4 text-sm outline-0 bg-slate-300 dark:bg-slate-600 focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <input
                v-model="contactForm.subject"
                type="text"
                :placeholder="$t('subject')"
                required
                class="w-full rounded-lg py-3 px-4 text-sm outline-0 bg-slate-300 dark:bg-slate-600 focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <textarea
                v-model="contactForm.message"
                :placeholder="$t('message')"
                rows="6"
                required
                class="w-full rounded-lg px-4 text-sm pt-3 outline-0 bg-slate-300 dark:bg-slate-600 focus:ring-2 focus:ring-blue-300 transition-all resize-none"
              />
              <CoreBtnDefault type="submit" class="w-full">
                {{ $t('sendMessage') }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#fff"
                  class="mx-2"
                  viewBox="0 0 548.244 548.244"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                    clip-rule="evenodd"
                  />
                </svg>
              </CoreBtnDefault>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="slide-up space-y-8">
            <!-- Office Info -->
            <div class="bg-white dark:bg-gray-700 rounded-xl card-shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {{ $t('contactPage.officeAddress') }}
              </h2>
              <div class="space-y-4">
                <div
                  v-for="info in officeInfo"
                  :key="info.id"
                  class="flex items-start space-x-3 space-x-reverse"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-300/20 mx-2"
                  >
                    <BaseIcon :name="info.icon" class="w-4" fill="#0084FF" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800 dark:text-white">
                      {{ $t(info.title) }}
                    </h3>
                    <p
                      v-for="(line, index) in info.content"
                      :key="index"
                      class="text-gray-600 dark:text-gray-400"
                    >
                      {{ line }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Map -->
            <div class="bg-white dark:bg-gray-700 rounded-xl card-shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {{ $t('location') }}
              </h2>
              <div class="w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d804.0092380220939!2d59.59885576968841!3d36.287153279287175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f6c91234f5352e1%3A0xceaea1ec3deee392!2sRazavi%20Khorasan%20Province%2C%20Mashhad%2C%20Emam%20Khomeini%20St%2C%20Iran!5e0!3m2!1sen!2sgr!4v1762577674899!5m2!1sen!2sgr"
                  width="100%"
                  height="175"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  :title="`${$t('contactPage.map')} ${$t(site?.siteName)}`"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <GeneralFaqSection />
  </div>
</template>
