<template>
  <div
    class="flex flex-col min-h-screen text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 transition-colors"
  >
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
