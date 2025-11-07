<script setup lang="ts">
const { site } = await useSiteInfo()
</script>
<template>
  <section class="gradient-bg py-20">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
        دنیای ارزهای دیجیتال در {{ $t(site?.siteName) }}
      </h2>
      <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        آخرین اخبار، آموزش‌های جامع و تحلیل‌های عمیق بازار ارزهای دیجیتال
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          class="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          مطالعه مقالات
        </button>
        <button
          class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
        >
          مشاهده آموزش‌ها
        </button>
      </div>
    </div>
  </section>
</template>
