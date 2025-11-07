<script setup lang="ts">
import { useOverlayStore } from '~/stores/overlay'
import { useAuth } from '@/composables/useAuth'

const { getProfile } = useAuth()

const localePath = useLocalePath()
const { toggleOverlay } = useOverlayStore()
const codeError: Ref<string | null> = ref(null)
const code = ref('')
const isLoading = ref(false)
const api = useApi()
const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'گام سوم',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام سوم`,
  ogTitle: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام سوم`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

watch(
  () => code,
  newVal => {
    codeError.value = useValidate(newVal.value, 'code')
  },
  { deep: true }
)

const validateForm = () => {
  codeError.value = useValidate(code.value, 'code')
  if (!codeError.value) {
    save()
  }
}

const save = async () => {
  try {
    isLoading.value = true
    toggleOverlay(true)
    await api.post('/api/v1/user/token-2fv-check', { code: code.value })
    await getProfile()
    navigateTo(localePath('/dashboard/security/totp/step3'))
  } finally {
    toggleOverlay(false)
    isLoading.value = false
  }
}
</script>
<template>
  <div class="container mx-auto">
    <CoreStep :step="3" />
    <div class="mt-8 w-full flex flex-col justify-center items-center space-y-4">
      <div>
        <span class="text-blue-400">گام سوم:</span>
        ثبت کد تایید
      </div>
      <div>
        کد ایجاد شده در برنامه Google Authenticator و کدی که به تازگی دریافت کرده اید را در کادر زیر
        وارد کنید.
      </div>
      <form
        @submit.prevent="validateForm()"
        class="w-full text-center flex flex-col justify-center items-center"
      >
        <label
          for="code"
          class="flex justify-center items-center font-medium text-gray-500 text-right mb-2"
        >
          کد شناسایی دوعاملی را وارد کنید
        </label>
        <input
          name="code"
          id="code"
          type="string"
          v-model="code"
          :class="codeError ? 'outline-none ring ring-red-500' : 'outline-none ring ring-blue-400'"
          class="rounded-md lg:rounded-lg bg-slate-200 text-center dark:bg-slate-700 border border-slate-50 dark:border-slate-900 w-full lg:w-96 h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
        />
        <p class="help-message text-red-500 text-right mt-1 text-sm" v-if="codeError">
          {{ $t(codeError) }}
        </p>
        <CoreBtnDefault :is-loading="isLoading" class="mt-2 lg:mt-4"> ادامه </CoreBtnDefault>
      </form>
    </div>
  </div>
</template>
