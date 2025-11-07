<script setup lang="ts">
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'معامله',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | معامله`,
  ogTitle: `صرافی ${site.value?.siteName} | معامله`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const { isLoading, items, getDashboardData } = await useDashboardData()
const { headers, orders, total, page, limit, loading, search, changePage, onInput, getData } =
  await useTrade()

onMounted(async () => {
  await getDashboardData()
  await getData()
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4 max-w-7xl">
    <!-- Skeleton while loading -->
    <SkeletonTrade v-if="isLoading || !items?.symbols?.length" />
    <!-- Main content -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormTradeFull
          :symbol="items?.symbols[0]"
          type="Buy"
          class="hidden md:block"
          @refresh="getData"
        />
        <FormTradeFull
          :symbol="items?.symbols[0]"
          type="Sell"
          class="hidden md:block"
          @refresh="getData"
        />
        <FormTrade :symbol="items?.symbols[0]" class="md:hidden" @refresh="getData()" />
      </div>
      <CoreCardDefault class="lg:col-span-2 p-2 lg:p-6">
        <div class="flex flex-col lg:flex-row justify-between items-center mb-4 w-full">
          <div class="w-full md:w-1/3">
            <CoreInputSearch v-model="search" @input="onInput" width="w-full" />
          </div>
        </div>
        <TableHistoryOrder
          :headers="headers"
          :items="orders"
          :total="total"
          :page="page"
          :limit="limit"
          :loading="loading"
          @change-page="changePage"
        />
      </CoreCardDefault>
    </div>
  </div>
</template>
