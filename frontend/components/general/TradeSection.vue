<script setup lang="ts">
defineProps<{ symbol: any }>()
</script>

<template>
  <div class="w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
    <FormTrade :symbol="symbol" />
  </div>
</template>
