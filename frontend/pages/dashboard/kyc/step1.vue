<script setup lang="ts">
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'احراز هویت پایه',
  layout: 'dashboard',
})

useSeoMeta({
  title: `احراز هویت پایه | ${site.value?.siteName}`,
  ogTitle: `احراز هویت پایه | ${site.value?.siteName}`,
  description: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی | ${site.value?.siteName}`,
  ogDescription: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی | ${site.value?.siteName}`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const showDialog = ref(false)
const {
  user,
  userData,
  isOpen,
  email,
  mobile,
  sendVerifyCode,
  checkCode,
  updateUser,
  checkVerify,
  isLoading,
  mobileError,
  emailError,
  imagePath,
} = useKYCStep1()
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreDialogVerifyCode v-model="isOpen" @completed="checkCode" />
    <CoreDialogReason v-model="showDialog" :reason="user?.reason" />
    <CoreStep :step="1" />
    <div
      class="alert-error p-2 rounded relative flex justify-between items-center mt-4"
      v-if="user?.reason"
    >
      احراز شما در این مرحله توسط کارشناسان ما رد شده است.
      <CoreBtnError class="mx-1" @click="showDialog = true">علت رد شدن </CoreBtnError>
    </div>
    <CoreCardDefault class="p-2 lg:p-6 mt-8">
      <h2 class="mb-2">احراز هویت پایه</h2>
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full">
        <div class="w-full flex flex-col justify-center items-center h-full gap-2">
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
            <CoreInputEmailVerify
              v-model="email"
              :disabled="user?.isEmailVerified ? user?.isEmailVerified : checkVerify"
              :isLoading="isLoading"
              :error="emailError"
              @sendVerifyCode="sendVerifyCode"
            />
            <CoreInputMobileVerify
              v-model="mobile"
              :disabled="user?.isMobileVerified ? user?.isMobileVerified : checkVerify"
              :isLoading="isLoading"
              :error="mobileError"
              @sendVerifyCode="sendVerifyCode"
            />
            <input
              name="firstName"
              placeholder="نام"
              id="firstName"
              type="text"
              v-model="userData.firstName"
              :disabled="isLoading || !checkVerify"
              :class="
                isLoading || !checkVerify
                  ? 'placeholder-slate-300 dark:placeholder-slate-500 bg-slate-100 dark:bg-slate-700'
                  : 'placeholder-slate-500 dark:placeholder-slate-300 bg-slate-200 dark:bg-slate-900'
              "
              class="rounded-md lg:rounded-lg bg-background-light-3 dark:bg-background-dark-3 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4 focus:outline-none focus:ring focus:ring-blue-400"
            />
            <input
              name="lastName"
              placeholder="نام خانوادگی"
              id="lastName"
              type="text"
              v-model="userData.lastName"
              :disabled="isLoading || !checkVerify"
              :class="
                isLoading || !checkVerify
                  ? 'placeholder-slate-300 dark:placeholder-slate-500 text-slate-300 dark:text-slate-500 bg-slate-100 dark:bg-slate-700'
                  : 'placeholder-slate-500 dark:placeholder-slate-300 bg-slate-200 dark:bg-slate-900'
              "
              class="rounded-md lg:rounded-lg bg-background-light-3 dark:bg-background-dark-3 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4 focus:outline-none focus:ring focus:ring-blue-400"
            />
            <input
              name="nationalCode"
              placeholder="شماره ملی"
              id="nationalCode"
              type="text"
              v-model="userData.nationalCode"
              maxlength="10"
              pattern="[0-9]*"
              inputmode="numeric"
              :disabled="isLoading || !checkVerify"
              :class="
                isLoading || !checkVerify
                  ? 'placeholder-slate-300 dark:placeholder-slate-500 text-slate-300 dark:text-slate-500 bg-slate-100 dark:bg-slate-700'
                  : 'placeholder-slate-500 dark:placeholder-slate-300 bg-slate-200 dark:bg-slate-900'
              "
              class="rounded-md lg:rounded-lg bg-background-light-3 dark:bg-background-dark-3 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4 focus:outline-none focus:ring focus:ring-blue-400"
            />
            <CoreInputDatePicker
              v-model="userData.birthday"
              :disabled="isLoading || !checkVerify"
            />
          </div>
        </div>
        <div class="w-full flex justify-center items-center">
          <CoreInputUploader v-model="imagePath" :disabled="isLoading || !checkVerify" />
        </div>
      </div>
      <div class="flex justify-end items-center mt-4">
        <CoreBtnDefault class="mx-1" @click="updateUser" :disabled="isLoading || !checkVerify"
          >ارسال اطلاعات
        </CoreBtnDefault>
      </div>
    </CoreCardDefault>
  </div>
</template>

<style scoped>
.file-input {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

.file-input:focus {
  outline: none;
}
</style>
