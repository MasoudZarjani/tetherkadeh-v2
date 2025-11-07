<script setup lang="ts">
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'احراز هویت تکمیلی',
  layout: 'dashboard',
})

useSeoMeta({
  title: `احراز هویت تکمیلی |${site.value?.siteName}`,
  ogTitle: `احراز هویت تکمیلی |${site.value?.siteName}`,
  description: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی |${site.value?.siteName}`,
  ogDescription: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی |${site.value?.siteName}`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const showDialog = ref(false)
const { user, imagePath, isLoading, updateUser } = useKYCStep2()
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreDialogReason v-model="showDialog" :reason="user?.reason" />
    <CoreStep :step="3" />
    <div
      class="alert-error p-2 rounded relative flex justify-between items-center mt-4"
      v-if="user?.reason"
    >
      احراز شما در این مرحله توسط کارشناسان ما رد شده است.
      <CoreBtnError class="mx-1" @click="showDialog = true">علت رد شدن </CoreBtnError>
    </div>
    <CoreCardDefault class="p-2 lg:p-6 mt-8">
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full">
        <div class="w-full flex justify-center items-center">
          <CoreInputUploader v-model="imagePath" :disabled="isLoading" />
        </div>
        <div class="w-full flex flex-col gap-4">
          <div class="alert-warning p-2 rounded">
            متن زیر را روی کاغذ نوشته و تاریخ و امضا درج کرده و اپلود بفرمایید. دقت کنید که کارت ملی
            را کنار چهره ی خود به گونه ای قرار داده که متن و کارت شناسایی به همراه چهره ی شما در عکس
            مشخص و واضح باشد.
          </div>
          <div class="alert-info p-2 rounded text-justify mt-2">
            اینجانب ....... به کدملی ........ جهت احرازهویت در {{ $t(site?.siteName) }}، ضمن مطالعه و
            تایید قوانین استفاده از خدمات {{ $t(site?.siteName) }}، متعهد میشوم که حساب کاربری خود را
            جهت خرید و فروش ارزهای دیجیتال در اختیار دیگران قرار ندهم و مسئولیت هرگونه سو استفاده
            توسط افراد سودجو از حساب کاربری خود را بپذیرم و در صورت تخلف، عواقب قضایی، حقوقی و مالی
            را به طور کامل به عهده بگیرم.
            <div class="w-full text-left">تاریخ و امضا</div>
          </div>
        </div>
      </div>

      <div class="flex justify-end items-center mt-4">
        <CoreBtnDefault class="mx-1" @click="updateUser" :disabled="isLoading"
          >ارسال اطلاعات
        </CoreBtnDefault>
      </div>
    </CoreCardDefault>
  </div>
</template>
