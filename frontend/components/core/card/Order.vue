<script setup lang="ts">
import type { Order } from '~/types/orders.types'

defineProps({
  item: {
    type: Object as PropType<Order>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('currency') }}:</div>
      <div>{{ item?.symbol?.symbol }} - {{ item?.pairSymbol?.symbol }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('amount') }}:</div>
      <div>{{ item?.amount }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('price') }}:</div>
      <div>{{ item?.price }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('trackId') }}:</div>
      <div>{{ item?.trackId }}</div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('side') }}:</div>
      <div :class="item?.side === 'Sell' ? 'text-red-500' : 'text-green-500'">
        {{ $t(item?.side?.toLowerCase()) }}
      </div>
    </div>
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('createdAt') }}:</div>
      <div>{{ useJalaliDate(item.createdAt) }}</div>
    </div>
  </div>
</template>
