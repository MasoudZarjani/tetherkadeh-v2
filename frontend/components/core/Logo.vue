<script setup lang="ts">
const { site } = await useSiteInfo()
</script>

<template>
  <NuxtImg
    loading="lazy"
    src="/logo.png"
    :alt="`لوگو صرافی ${$t(site?.siteName || 'tetherkade')}`"
  />
</template>
