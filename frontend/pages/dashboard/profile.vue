<script lang="ts" setup>
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'پروفایل',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | پروفایل کاربری`,
  ogTitle: `صرافی ${site.value?.siteName} | پروفایل کاربری`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const { dialog, user, jalali, isLoading, confirm, openModal } = useProfile()
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreDialogChangePassword v-model="dialog" :loading="isLoading" @confirm="confirm" />
    <CoreCardDefault class="p-4 lg:p-6" v-if="user">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <CoreInputTextfield
          v-model="user.uid"
          :error="null"
          id="UID"
          name="UID"
          type="text"
          label="UID"
          class="mt-4"
          :disabled="true"
        />
      </div>
      <div class="mt-6 pt-4 text-base lg:text-2xl border-t border-gray-200 dark:border-gray-700">
        {{ $t('personalInformation') }}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <CoreInputTextfield
          v-model="user.firstName"
          :error="null"
          id="firstName"
          name="firstName"
          type="text"
          label="firstName"
          class="mt-4"
          :disabled="true"
        />
        <CoreInputTextfield
          v-model="user.lastName"
          :error="null"
          id="lastName"
          name="lastName"
          type="text"
          label="lastName"
          class="mt-4"
          :disabled="true"
        />
        <CoreInputTextfield
          v-model="user.nationalCode"
          :error="null"
          id="nationalCode"
          name="nationalCode"
          type="text"
          label="nationalCode"
          class="mt-4"
          :disabled="true"
        />
        <CoreInputTextfield
          v-model="jalali"
          :error="null"
          id="birthday"
          name="birthday"
          type="text"
          label="birthday"
          class="mt-4"
          :disabled="true"
        />
      </div>
      <div class="mt-6 pt-4 text-base lg:text-2xl border-t border-gray-200 dark:border-gray-700">
        {{ $t('contactInfo') }}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6 mt-4">
        <CoreInputTextfield
          v-model="user.email"
          :error="null"
          id="email"
          name="email"
          type="text"
          label="email"
          class="mt-4"
          :disabled="true"
        />
        <CoreInputTextfield
          v-model="user.mobile"
          :error="null"
          id="mobile"
          name="mobile"
          type="text"
          label="mobile"
          class="mt-4"
          :disabled="true"
        />
      </div>
      <div class="mt-10 pt-4 text-base lg:text-2xl border-t border-gray-200 dark:border-gray-700">
        {{ $t('contactInfoAccount') }}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6 mt-4">
        <div
          class="flex relative items-center w-full bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-gray-700 h-10 lg:h-12 appearance-none rounded-md lg:rounded-lg px-3 py-2 text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 sm:text-sm"
        >
          ************
          <div
            class="absolute left-1 bg-blue-400 text-white h-8 lg:h-10 flex items-center rounded-lg px-2 cursor-pointer"
            @click="openModal"
          >
            {{ $t('changePassword') }}
          </div>
        </div>
      </div>
    </CoreCardDefault>
  </div>
</template>
