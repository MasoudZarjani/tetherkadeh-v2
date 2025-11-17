<script setup lang="ts">
const { site } = await useSiteInfo()
const { locale } = useI18n()
const items = [
  [
    {
      title: 'policies',
      external: false,
      to: '/policies',
    },
    {
      title: 'faq',
      external: false,
      to: '/faq',
    },
    {
      title: 'aboutUs',
      external: false,
      to: '/about-us',
    },
    {
      title: 'contactUs',
      external: false,
      to: '/contact-us',
    },
  ],
  [
    
    {
      title: site?.value?.email,
      to: `mailto:${site?.value?.mobile}`,
      external: true,
    },
  ],
]
const socials = [
  {
    icon: 'youtube',
    to: site?.value?.youtube,
  },
  {
    icon: 'instagram',
    to: site?.value?.instagram,
  },
  {
    icon: 'telegram',
    to: site?.value?.telegram,
  }
]
const headers = ['quickAccess', 'contactUs']
</script>

<template>
  <div class="relative m w-full bg-slate-50 dark:bg-slate-800">
    <div
      class="grid-cols-3 gap-8 px-8 pt-6 text-center md:grid"
      :class="locale === 'fa' ? 'md:text-right' : 'md:text-left'"
    >
      <div class="flex w-full flex-col items-center justify-start gap-4 text-center">
        <CoreLogo class="w-10" />
        {{ $t('supportBody') }}
      </div>
      <div v-for="(item, i) in items">
        <div class="mb-8 text-xl font-extrabold">{{ $t('navigation.' + headers[i]) }}</div>
        <div class="my-4 w-full" v-for="element in item">
          <a
            v-if="element.external"
            :href="element.to"
            target="_blank"
            class="flex items-center hover:text-blue-400"
          >
            {{ element.title }}
          </a>
          <nuxt-link
            v-else
            :to="$localePath(element.to)"
            class="flex items-center hover:text-blue-400"
          >
            {{ $t('navigation.' + element.title) }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <hr class="w-full border-gray-200 dark:border-gray-700" />
    <div
      class="bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-between px-2 py-2 lg:flex-row lg:px-8"
    >
      <div>
        {{ $t('copyright1') }}
        <a href="https://tetherkade.com" class="text-blue-400"
          >{{ $t('cryptoExchange') }} {{ $t(site?.siteName || 'tetherkade') }}</a
        >
        {{ $t('copyright2') }}
      </div>
      <div class="my-4 flex items-center justify-center lg:my-0">
        <div class="px-2 w-12" v-for="social in socials">
          <a :href="social.to" target="_blank">
            <BaseIcon :name="social.icon" className="w-8 h-8" fill="#0084FF" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
