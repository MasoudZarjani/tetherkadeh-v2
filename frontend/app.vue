<script setup lang="ts">
const { locale } = useI18n()
const colorMode = useColorMode()

useHead({
  htmlAttrs: {
    'data-theme': colorMode.preference || 'light',
  },
})
</script>
<template>
  <!-- Google Tag Manager (noscript) -->
  <noscript
    ><iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-T9H262KB"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    ></iframe
  ></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div
    :dir="locale === 'en' ? 'ltr' : 'rtl'"
    id="app"
    class="h-full"
    :class="
      locale === 'en' ? 'font-en direction-ltr text-left' : 'font-ir direction-rtl text-right'
    "
  >
    <NuxtLayout>
      <NuxtPwaManifest />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
