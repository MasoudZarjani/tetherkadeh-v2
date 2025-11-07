<script setup lang="ts">
const { site } = await useSiteInfo()
const { locale } = useI18n()

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
  breadcrumbs: 'پنل کاربری',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | داشبورد کاربری`,
  ogTitle: `صرافی ${site.value?.siteName} | داشبورد کاربری`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const {
  isLoading,
  user,
  items,
  headers,
  orders,
  priceData,
  primarySymbol,
  hasSymbols,
  lastBuyPrice,
  availableIRT,
  availableUSDT,
  totalAssetsIRT,
  totalAssetsUSDT,
  getDashboardData,
} = await useDashboardData()

// Fetch data on mount
onMounted(() => {
  getDashboardData()
})
</script>
<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4 max-w-7xl">
    <!-- هشدار احراز هویت -->
    <CoreAlertKyc v-if="user?.status === 'Register'" class="mb-2" :status="user?.stepRequest" />

    <!-- قیمت تتر -->
    <CoreCardDefault class="mb-4">
      <LazyPublicPriceTicker
        v-if="!isLoading && lastBuyPrice"
        :price="lastBuyPrice"
        :diff24="priceData?.pctChange || 0"
        :openPrice="priceData?.openPrice || 0"
      />
      <SkeletonPriceTickerSkeleton v-else />
    </CoreCardDefault>

    <!-- کارت‌های گزارش -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <CoreCardReport
        className="bg-blue-500/20 pulse-blue"
        iconFill="#3b82f6"
        symbol=""
        :label="$t('fiatBalance')"
        :value="useDigitNumber(availableIRT, 0)"
        icon="wallet"
      >
        <div>{{ $t('tmn') }}</div>
      </CoreCardReport>

      <CoreCardReport
        iconFill="#22c55e"
        className="bg-green-500/20 pulse-green"
        :label="$t('usdtBalance')"
        symbol=""
        :value="useDigitNumber(availableUSDT, 2)"
        icon="dollar"
      >
        <div>USDT</div>
      </CoreCardReport>

      <CoreCardReport
        iconFill="#155dfc"
        className="bg-slate-200 dark:bg-slate-700"
        :label="$t('totalAssets')"
        :symbol="$t('tmn')"
        :value="useDigitNumber(totalAssetsIRT, 0)"
        icon="transfer"
      >
        <div class="text-xs text-gray-400">≈ {{ useDigitNumber(totalAssetsUSDT, 4) }} USDT</div>
      </CoreCardReport>
    </div>

    <!-- فرم‌های خرید و فروش -->
    <div v-if="!isLoading && hasSymbols" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormTradeFull
        :symbol="primarySymbol"
        type="Buy"
        class="hidden md:block"
        @refresh="getData"
      />
      <FormTradeFull
        :symbol="primarySymbol"
        type="Sell"
        class="hidden md:block"
        @refresh="getData"
      />
      <FormTrade :symbol="primarySymbol" class="md:hidden" @refresh="getData" />
    </div>

    <!-- جدول سفارش‌ها و اطلاعیه -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <CoreCardDefault class="p-2 lg:p-6 order-2 md:order-1">
        <div class="flex flex-col lg:flex-row justify-between items-center mb-4 w-full">
          <div class="w-full md:w-1/3">{{ $t('lastOrders') }}</div>
        </div>
        <TableHistoryOrder
          :headers="headers"
          :items="orders"
          :total="5"
          :page="1"
          :limit="5"
          :loading="isLoading"
        />
      </CoreCardDefault>

      <CoreCardDefault class="p-2 lg:p-6 order-1 md:order-2">
        <div
          v-if="locale === 'fa'"
          class="flex flex-col justify-start items-start gap-4 mb-4 w-full"
        >
          <div class="w-full md:w-1/3">اطلاعیه</div>

          <div class="flex justify-center items-center">
            <div class="w-2 h-2 rounded-full bg-blue-400 ml-2"></div>
            به صرافی <strong class="text-blue-400 my-2">{{ site?.siteName || '' }}</strong> خوش
            آمدید.
          </div>

          <div class="flex justify-center items-center">
            <div class="w-2 h-2 rounded-full bg-blue-400 ml-2"></div>
            اولین برداشت بعد از 72 ساعت انجام خواهد شد.
          </div>

          <div class="flex justify-center items-center">
            <div class="w-2 h-2 rounded-full bg-blue-400 ml-2"></div>
            برداشت های بعدی با توجه به شرایط حساب بین 1 تا 72 ساعت انجام خواهد شد.
          </div>
        </div>
      </CoreCardDefault>
    </div>

    <!-- Statistics -->
    <div
      v-if="!isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
    >
      <CoreCardDefault class="text-center p-2">
        <div class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ items.orderCount || 0 }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {{ $t('allTrades') }}
        </div>
      </CoreCardDefault>

      <CoreCardDefault class="text-center p-2">
        <div class="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
          {{ items.depositCount || 0 }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {{ $t('successfulDeposit') }}
        </div>
      </CoreCardDefault>

      <CoreCardDefault class="text-center p-2">
        <div class="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
          {{ items.withdrawalCount || 0 }}
        </div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {{ $t('successfulWithdraw') }}
        </div>
      </CoreCardDefault>

      <CoreCardDefault class="text-center p-2">
        <div class="text-xl sm:text-2xl font-bold" style="color: #155dfc">0</div>
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {{ $t('totalProfit') }}
        </div>
      </CoreCardDefault>
    </div>
  </div>
</template>
