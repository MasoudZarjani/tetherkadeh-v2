<script setup lang="ts">
const items = [
  {
    text: 'referral',
    icon: 'referral',
    to: '/referral',
  },
  {
    text: 'history',
    icon: 'history',
    to: '/histories',
  },
]
</script>
<template>
  <CoreCardDefault class="p-4 mt-4 lg:hidden">
    <div class="grid grid-cols-4 gap-4">
      <NuxtLink
        :prefetch="false"
        class="flex flex-col justify-center items-center"
        v-for="(item, index) in items"
        :key="index"
        :to="$localePath(item.to)"
      >
        <BaseIcon :name="item.icon" class="mb-1 w-6 h-6 fill-black dark:fill-white" />
        <span class="quick-access-font text-black dark:text-white">{{ $t(item.text) }}</span>
      </NuxtLink>
      <a
        href="https://goftino.com/c/wwElWS"
        target="_blank"
        class="flex flex-col justify-center items-center"
      >
        <BaseIcon name="chat" className="mb-1 w-6 h-6 fill-black dark:fill-white" />
        <span class="quick-access-font text-black dark:text-white">{{ $t('chat') }}</span>
      </a>
    </div>
  </CoreCardDefault>
</template>
