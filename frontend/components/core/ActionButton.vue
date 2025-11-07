<template>
  <NuxtLink
    :to="$localePath(to)"
    class="p-4 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 backdrop-blur-sm relative flex flex-col justify-center items-center space-y-2 w-full text-white rounded-xl transition-all transform hover:scale-105 cursor-pointer"
  >
    <BaseIcon :name="icon" className="w-10 h-10 fill-slate-800 dark:fill-slate-200" />
    <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ label }}</div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  to: string
}>()
</script>
