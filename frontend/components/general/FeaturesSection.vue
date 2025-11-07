<script setup lang="ts">
import { services } from '~/constants/services'

const { site } = await useSiteInfo()
</script>
<template>
  <section id="features" class="py-20 bg-white dark:bg-slate-800">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {{ $t('why') }} {{ $t(site?.siteName) }}؟
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{ $t('serviceSlogan') }}
        </p>
      </div>
      <GeneralServiceList :items="services" />
    </div>
  </section>
</template>
