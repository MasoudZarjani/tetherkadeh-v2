<script setup lang="ts">
const { site } = await useSiteInfo()
</script>

<template>
  <div id="app">
    <CoreOverlay />
    <CoreAlertDefault />
    <div
      class="flex justify-start items-start w-full text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 transition-colors min-h-screen"
    >
      <div
        class="w-full flex justify-center items-center lg:w-1/3 bg-slate-50 dark:bg-slate-800 border-l min-h-screen border-gray-200 dark:border-gray-700 text-center px-8 lg:px-16"
      >
        <slot />
      </div>
      <div class="hidden lg:flex flex-col justify-center items-center w-2/3 relative">
        <div class="flex flex-col justify-start items-center absolute top-0 w-full mt-16">
          <NuxtLink :prefetch="false" :to="$localePath('/')" class="text-center">
            <CoreLogo class="w-48" />
          </NuxtLink>
        </div>
        <div class="flex flex-col justify-center items-center w-full min-h-screen">
          <div class="text-3xl mt-8">
            {{ $t('with') }} <strong class="text-blue-400">{{ $t(site?.siteName) }}</strong> {{ $t('authSlogan') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
