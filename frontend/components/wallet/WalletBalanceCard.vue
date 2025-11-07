<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  title: string
  subtitle: string
  icon: string
  alt: string
  currency: string
  fiatCurrency: string
  balance: number
  fiatEquivalent: number
  available: number
  blocked: number
  withdrawUrl: string
  depositUrl: string
  digits?: number
}>()
</script>

<template>
  <div class="balance-card rounded-xl p-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-center items-center md:justify-between mb-6 gap-2"
    >
      <div class="flex items-center space-x-reverse space-x-3">
        <div class="w-12 h-12 rounded-full flex justify-center items-center">
          <NuxtImg :src="icon" :alt="alt" />
        </div>
        <div class="mr-2 w-full">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
        </div>
      </div>
      <div class="text-center md:text-right w-full md:w-auto">
        <div class="text-2xl font-bold">{{ useDigitNumber(balance, digits || 0) }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ currency }}</div>
      </div>
    </div>

    <!-- Details -->
    <div class="space-y-3 text-sm">
      <div class="flex justify-between">
        <span>{{ $t('equivalent') }}:</span>
        <span class="font-semibold"
          >{{ useDigitNumber(fiatEquivalent, 2) }} {{ fiatCurrency }}</span
        >
      </div>
      <div class="flex justify-between">
        <span>{{ $t('withdrawable') }}:</span>
        <span class="font-semibold"
          >{{ useDigitNumber(available, digits || 0) }} {{ currency }}</span
        >
      </div>
      <div class="flex justify-between">
        <span>{{ $t('blocked') }}:</span>
        <span class="text-gray-500">{{ useDigitNumber(blocked, digits || 0) }} {{ currency }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between mt-8 px-6">
      <button
        @click="navigateTo(localePath(withdrawUrl))"
        class="w-1/2 flex flex-col items-center cursor-pointer"
      >
        <BaseIcon name="withdraw" className="w-8 fill-slate-800 dark:fill-slate-200" />
        <span class="mt-2">{{ $t('withdraw') }}</span>
      </button>
      <button
        @click="navigateTo(localePath(depositUrl))"
        class="w-1/2 flex flex-col items-center cursor-pointer"
      >
        <BaseIcon name="deposit" className="w-8 fill-slate-800 dark:fill-slate-200" />
        <span class="mt-2">{{ $t('deposit') }}</span>
      </button>
    </div>
  </div>
</template>
