<script setup lang="ts">
const { t } = useI18n()

interface Tab {
  name: string
  key: string
  current: boolean
  link?: string
}

const props = defineProps({
  currentTab: {
    type: String,
    default: 'transactions',
  },
})

const tabs = ref<Tab[]>([
  {
    name: t('deposits'),
    key: 'deposits',
    current: props.currentTab === 'deposits' ? true : false,
    link: '/dashboard/histories/transactions/deposits',
  },
  {
    name: t('withdraws'),
    key: 'withdraws',
    current: props.currentTab === 'withdraws' ? true : false,
    link: '/dashboard/histories/transactions/withdraws',
  },
])
</script>

<template>
  <div class="flex w-full gap-2 lg:gap-4 items-center">
    <nuxt-link
      v-for="(tab, index) in tabs"
      :key="index"
      :to="$localePath(tab.link)"
      class="lg:font-medium text-xs lg:text-sm cursor-pointer mb-2"
      :class="
        tab.current ? 'text-blue-400' : 'text-gray-500 dark:text-gray-200 hover:text-blue-400'
      "
    >
      {{ tab.name }}
    </nuxt-link>
  </div>
</template>
