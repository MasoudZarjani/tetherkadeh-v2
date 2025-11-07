<script setup lang="ts">
interface Tab {
  name: string
  key: string
  current: boolean
  link?: string
}

const props = defineProps({
  currentTab: {
    type: String,
    default: 'orders',
  },
})

const tabs = ref<Tab[]>([
  {
    name: 'withdrawIrt',
    key: 'bank',
    current: props.currentTab === 'bank' ? true : false,
    link: '/dashboard/wallet/withdraw/bank',
  },
  {
    name: 'withdrawCurrency',
    key: 'crypto',
    current: props.currentTab === 'crypto' ? true : false,
    link: '/dashboard/wallet/withdraw/crypto',
  },
])
</script>

<template>
  <div class="flex w-full">
    <nuxt-link
      v-for="(tab, index) in tabs"
      :key="index"
      :to="$localePath(tab.link)"
      class="lg:px-3 px-1 py-2 lg:font-medium text-xs lg:text-sm cursor-pointer mb-2"
      :class="
        tab.current ? 'text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:text-blue-400'
      "
    >
      {{ $t(tab.name) }}
    </nuxt-link>
  </div>
</template>
