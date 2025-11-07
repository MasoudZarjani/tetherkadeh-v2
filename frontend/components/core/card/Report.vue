<script setup lang="ts">
const { locale } = useI18n()
defineProps<{
  label: string
  value: string
  icon: string
  className: string
  iconFill: string
  symbol: string
}>()
</script>
<template>
  <div
    class="bg-slate-50 dark:bg-slate-800 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
  >
    <div class="flex items-center justify-between">
      <div :class="locale === 'fa' ? 'text-right' : 'text-left'">
        <div class="text-sm text-gray-400">{{ label }}</div>
        <span class="text-2xl font-bold text-blue-400">{{ value }}</span
        ><span class="text-blue-400 mx-1">{{ symbol }}</span>
        <slot />
      </div>
      <div :class="className" class="w-12 h-12 rounded-full flex items-center justify-center">
        <BaseIcon :name="icon" :fill="iconFill" className="w-8 h-8" />
      </div>
    </div>
  </div>
</template>
