<script setup lang="ts">
import type { Transaction } from '~/types/transactions.types'

defineProps({
  item: {
    type: Object as PropType<Transaction>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('createdAt') }}:</div>
      <div>{{ useJalaliDate(item.createdAt) }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('currency') }}:</div>
      <div>{{ item.coin }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('amount') }}:</div>
      <div :class="item.type === 'withdraw' ? 'text-red-500' : 'text-green-500'">
        {{ useDigitNumber(item.amount, 8) }}
      </div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('trackId') }}/{{ $t('txid') }}:</div>
      <div>{{ item?.transactionId }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('description') }}:</div>
      <div>{{ item?.reason }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('status') }}:</div>
      <div class="px-2 text-sm rounded-full" :class="useStatusColor(item.status)">
        {{ $t(item.status.toLowerCase()) }}
      </div>
    </div>
  </div>
</template>
