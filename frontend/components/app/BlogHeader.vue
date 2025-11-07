<template>
  <header
    class="bg-slate-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3 space-x-reverse">
          <nuxt-link
            :to="$localePath('/')"
            class="flex items-center md:space-x-3 md:space-x-reverse"
          >
            <CoreLogo class="w-12 h-12 rounded-full flex items-center justify-center" />
          </nuxt-link>
          <h1 class="text-xl font-bold text-blue-400 mr-2">{{ $t('blogExchange') }}</h1>
        </div>
        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8 space-x-reverse">
          <a
            href="#"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
            >{{ $t('home') }}</a
          >
          <a
            href="#articles"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
            >{{ $t('articles') }}</a
          >
          <a
            href="#news"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
            >{{ $t('news') }}</a
          >
          <a
            href="#tutorials"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
            >{{ $t('tutorials') }}</a
          >
          <a
            href="#multimedia"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
            >{{ $t('multimedia') }}</a
          >
        </nav>
        <CoreColorMode />
      </div>
    </div>
  </header>
</template>
