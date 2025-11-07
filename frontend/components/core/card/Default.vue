<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <div
    class="bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 backdrop-blur-sm rounded-xl md:p-4 relative"
    :class="className"
  >
    <slot />
  </div>
</template>
