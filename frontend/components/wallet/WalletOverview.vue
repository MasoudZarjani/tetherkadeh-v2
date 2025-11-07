<script setup lang="ts">
const { usdtWallet, irtWallet } = defineProps(['usdtWallet', 'irtWallet'])
</script>

<template>
  <div class="balance-card rounded-xl p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ $t('totalInventory') }}</h3>
      <div class="w-14 h-14 gradient-bg rounded-full flex items-center justify-center">
        <BaseIcon name="wallet" fill="#3b82f6" className="w-10 h-10" />
      </div>
    </div>
    <div class="text-3xl font-bold mb-2">
      {{ useDigitNumber(usdtWallet.totalIRT + irtWallet.totalIRT, 0) }} {{ $t('tmn') }}
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-400">
      {{ $t('equivalent') }}
      <span class="font-semibold"
        >{{ useDigitNumber(usdtWallet.totalUSDT + irtWallet.totalUSDT, 2) }} USDT</span
      >
    </div>
  </div>
</template>
