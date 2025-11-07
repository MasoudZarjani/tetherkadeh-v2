<script setup lang="ts">
interface Tab {
  name: string
  key: string
  current: boolean
  link?: string
  status: boolean
}

const props = defineProps({
  currentTab: {
    type: String,
    default: 'orders',
  },
  status: {
    type: Boolean,
    default: true,
  },
})

const tabs = ref<Tab[]>([
  {
    name: 'depositIrt',
    key: 'bank',
    current: props.currentTab === 'bank' ? true : false,
    status: props.status,
    link: '/dashboard/wallet/deposit/bank',
  },
  {
    name: 'depositAccount',
    key: 'identified',
    current: props.currentTab === 'identified' ? true : false,
    status: props.status,
    link: '/dashboard/wallet/deposit/identified',
  },
  {
    name: 'depositCurrency',
    key: 'crypto',
    current: props.currentTab === 'crypto' ? true : false,
    status: props.status,
    link: '/dashboard/wallet/deposit/crypto',
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
        tab.current
          ? 'text-blue-400 border-b border-blue-400'
          : tab.status
            ? 'text-gray-700 dark:text-gray-200 hover:text-blue-400'
            : 'text-gray-300'
      "
    >
      {{ $t(tab.name) }}
    </nuxt-link>
  </div>
</template>
