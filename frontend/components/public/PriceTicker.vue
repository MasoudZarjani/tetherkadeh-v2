<script setup lang="ts">
const props = defineProps<{
  price: number
  diff24: number
  openPrice: number
}>()

const isUp = computed(() => props.diff24 > 0)
</script>

<template>
  <div class="text-center p-2">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">{{ $t('lastUsdtPrice') }}</h2>

    <div class="flex flex-row justify-center items-center gap-4 sm:gap-8">
      <!-- قیمت -->
      <div class="text-center">
        <div class="text-2xl sm:text-3xl font-bold text-green-500">
          {{ useDigitNumber(price, 0) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('tmn') }}</div>
      </div>

      <!-- تغییر 24 ساعته -->
      <div class="text-center">
        <div :class="isUp ? 'text-green-400' : 'text-red-400'" class="text-lg font-medium">
          {{ useDigitNumber(diff24, 2) }}%
          <span>{{ isUp ? '↑' : '↓' }}</span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">24h</div>
      </div>

      <div class="text-center">
        <div class="text-lg text-gray-700 dark:text-gray-300">
          {{ useDigitNumber(openPrice, 0) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('firstPrice') }}</div>
      </div>
    </div>
  </div>
</template>
