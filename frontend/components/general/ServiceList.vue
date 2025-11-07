<script setup lang="ts">
defineProps<{ items: Array<{ icon: string; title: string; body: string }> }>()
</script>

<template>
  <div class="grid w-full grid-cols-2 md:my-6 md:grid-cols-4 md:gap-10">
    <div
      v-for="item in items"
      :key="item.title"
      class="flex flex-col items-center justify-start px-4"
    >
      <span class="flex items-center justify-center">
        <BaseIcon :name="item.icon" className="w-24" />
      </span>
      <div class="font-semibold md:my-4 md:text-base">{{ $t(item.title) }}</div>
      <div class="hidden md:flex text-center">{{ $t(item.body) }}</div>
    </div>
  </div>
</template>
