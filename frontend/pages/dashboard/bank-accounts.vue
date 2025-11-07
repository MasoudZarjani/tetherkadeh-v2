<script setup lang="ts">
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'حساب های بانکی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | حساب های بانکی`,
  ogTitle: `صرافی ${site.value?.siteName} | حساب های بانکی`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
const {
  user,
  dialog,
  cards,
  currentCard,
  totalCards,
  dashedNumber,
  openModal,
  confirm,
  getData,
  goPrev,
  goNext,
} = await useBankAccount()

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreAlertKyc class="mb-4" />
    <CoreDialogBankAccount v-model="dialog" @confirm="confirm" />
    <div class="w-full p-4 bg-blue-200 mb-2 flex justify-start items-center rounded-lg">
      <BaseIcon name="info" className="w-6" />
      <span class="mx-2 text-black"
        >{{ $t('bankAccountTitle1') }}
        <span class="font-bold text-blue-500 underline">
          {{ user?.firstName }}
          {{ user?.lastName }}
        </span>
        {{ $t('bankAccountTitle2') }}
      </span>
    </div>
    <CoreCardDefault class="p-2 lg:p-6">
      <div class="flex justify-right items-center">
        <div class="text-lg lg:text-2xl">{{ $t('bankAccount') }}</div>
        <div
          class="bg-blue-400 text-white text-sm mx-2 flex items-center rounded-full px-2 py-1 cursor-pointer"
          @click="openModal"
        >
          {{ $t('addAccount') }}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <!-- کارت بانکی -->
        <div class="flex justify-center items-center" v-if="totalCards > 0">
          <CoreIcon
            name="arrow-right"
            class="h-10 w-10"
            :class="currentCard > 0 ? 'fill-blue-400 cursor-pointer' : 'dark:fill-gray-1'"
            @click="goPrev"
          />
          <div>
            <div class="relative w-full text-white">
              <div class="absolute right-4 top-4">
                {{ $t('bank.' + cards.data[currentCard]?.name?.toLowerCase()) }}
              </div>
              <div
                class="absolute left-0 top-16 lg:top-32 text-sm lg:text-2xl font-black w-full text-center en-font direction-ltr"
              >
                {{ dashedNumber }}
              </div>
              <div
                class="absolute left-0 top-20 lg:top-40 text-xs lg:text-xl font-bold w-full text-center en-font"
              >
                {{ cards.data[currentCard]?.shebaNumber }}
              </div>
              <div class="absolute right-4 top-28 lg:top-56">
                {{ user?.firstName }} {{ user?.lastName }}
              </div>
            </div>
            <img src="/bankAccount.png" alt="bank-account" />
          </div>
          <CoreIcon
            name="arrow-left"
            class="h-10 w-10"
            :class="
              currentCard + 1 < totalCards && totalCards > 1
                ? 'fill-primary-1 cursor-pointer'
                : 'dark:fill-gray-1'
            "
            @click="goNext"
          />
        </div>
        <!-- اضافه کردن حساب جدید -->
        <div class="w-full flex flex-col gap-4">
          <div class="alert-warning p-2 rounded">
            <div>{{ $t('bankAccountP1') }}</div>
            <div>{{ $t('bankAccountP2') }}</div>
          </div>
        </div>
        <div>{{ $t('cardCount') }}: {{ totalCards }}</div>
      </div>
    </CoreCardDefault>
  </div>
</template>
