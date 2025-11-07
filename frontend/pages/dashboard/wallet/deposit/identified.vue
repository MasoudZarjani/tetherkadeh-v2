<script lang="ts" setup>
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'واریز شناسه دار',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | واریز شناسه دار`,
  ogTitle: `صرافی ${site.value?.siteName} | واریز شناسه دار`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {{}}
      <CoreCardDefault class="p-2 lg:p-6">
        <CoreInputTabDeposit currentTab="identified" :status="true" />
        <div class="flex flex-col space-y-4 mt-2">
          <span class="bg-slate-200 dark:bg-slate-700 rounded p-1 lg:p-2">
            <div class="flex justify-between items-center w-full my-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('bank.title') }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-bold"> {{ $t('bank.meli') }} </span>
            </div>
            <div class="flex justify-between items-center w-full my-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('shebaNumber') }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-bold flex items-center">
                {{ site?.identifiedInfo[0]?.shebaNumber }}
                <BaseIcon
                  name="copy"
                  className="cursor-pointer mx-2"
                  @click="useCopy(site?.identifiedInfo[0]?.shebaNumber)"
                />
              </span>
            </div>
            <div class="flex justify-between items-center w-full my-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('accountNumber') }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-bold flex items-center">
                {{ site?.identifiedInfo[0]?.accountNumber }}
                <BaseIcon
                  name="copy"
                  className="cursor-pointer mx-2"
                  @click="useCopy(site?.identifiedInfo[0]?.accountNumber)"
                />
              </span>
            </div>
            <div class="flex justify-between items-center w-full my-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('inName') }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-bold">
                {{ site?.identifiedInfo[0]?.accountName }}
              </span>
            </div>
          </span>
        </div>
      </CoreCardDefault>
      <CoreCardDefault class="flex flex-col justify-start p-2 lg:p-6 text-yellow-400">
        <div class="flex justify-start items-center gap-2 mb-2 font-bold">
          <svg
            data-v-2dfb639a=""
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-labelledby="alert"
            class=""
            data-v-dc61674c=""
          >
            <path
              d="M2.28419 16.625H16.7167C18.1925 16.625 19.1125 15.0246 18.3746 13.75L11.1584 1.28211C10.4204 0.00752604 8.58044 0.00752604 7.84253 1.28211L0.626275 13.75C-0.111642 15.0246 0.808358 16.625 2.28419 16.625ZM9.50044 9.91669C8.97336 9.91669 8.54211 9.48544 8.54211 8.95836V7.04169C8.54211 6.51461 8.97336 6.08336 9.50044 6.08336C10.0275 6.08336 10.4588 6.51461 10.4588 7.04169V8.95836C10.4588 9.48544 10.0275 9.91669 9.50044 9.91669ZM10.4588 13.75H8.54211V11.8334H10.4588V13.75Z"
              fill="#EEA003"
            ></path>
          </svg>
          <div>
            {{ $t('depositPage.identified.alert1') }}
          </div>
        </div>
        <p class="my-1 flex justify-start items-center">
          <span class="w-2 h-2 bg-yellow-400 mx-2 rounded-full"></span>
          {{ $t('depositPage.identified.alert2') }}
        </p>
        <p class="my-1 flex justify-center items-center mt-2">
          <a :href="site?.telegram" target="_blank" class="text-blue-400-1 font-bold text-xl">{{
            site?.telegram
          }}</a>
        </p>
      </CoreCardDefault>
    </div>
  </div>
</template>
