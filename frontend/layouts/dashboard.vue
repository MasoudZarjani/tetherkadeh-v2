<template>
  <div
    id="app"
    class="text-xs md:text-sm lg:text-base overflow-x-hidden h-dvh min-h-dvh text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 transition-colors"
  >
    <CoreOverlay />
    <CoreAlertDefault />
    <AppMenu />
    <AppNav />
    <div class="w-full min-h-[calc(100vh-4rem)] relative mb-16 lg:mb-0">
      <slot />
    </div>
    <CoreCryptoPriceTicker />
    <AppNavigation class="md:hidden" />
  </div>
</template>
