<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useOverlayStore } from '~/stores/overlay'

const api = useApi()
const { toggleOverlay } = useOverlayStore()
const { site } = await useSiteInfo()
const { locale } = await useI18n()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'گام دوم',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام دوم`,
  ogTitle: `صرافی ${site.value?.siteName} | فعالسازی شناسه دو عاملی گام دوم`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

const token = ref('')
const urlToken = ref('')
const loading = ref(false)

onBeforeMount(async () => {
  await getData()
})

const getData = async () => {
  try {
    toggleOverlay(true)
    loading.value = true
    const data: any = await api.get(`/api/v1/user/token-2fv`)
    urlToken.value = data.urlToken
    const split = data.urlToken.split('otpauth://totp/tetherkade?secret=')
    token.value = split[1]
  } finally {
    loading.value = false
    toggleOverlay(false)
  }
}

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}
</script>
<template>
  <div class="container mx-auto" v-if="!loading">
    <CoreStep :step="2" />
    <div class="mt-8 w-full flex flex-col justify-center items-center space-y-4">
      <div>
        <span class="text-blue-400-1">{{ $t('step2') }}</span>
        {{ $t('scanCode') }}
      </div>
      <div>{{ $t('scanCodeTitle') }}</div>
      <div>
        {{ $t('scanCodeSubtitle') }}
      </div>
      <div class="p-2 rounded-xl border border-blue-400 bg-white">
        <qrcode-vue :value="urlToken" :size="200" level="M" />
      </div>
      <div
        class="p-2 rounded-md bg-slate-50 dark:bg-slate-800 flex justify-center items-center max-w-full overflow-hidden"
      >
        <BaseIcon name="copy" className="cursor-pointer w-6" @click="useCopy(token)" />
        <div class="mr-1 lg:mr-4 w-full text-xs lg:hidden">
          {{ useShortener(token) }}
        </div>
        <div class="mr-1 lg:mr-4 max-w-full text-base hidden lg:flex">
          {{ token }}
        </div>
      </div>
      <CoreBtnDefault @click="openModal()">{{ $t('iScanned') }}</CoreBtnDefault>
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog
        as="div"
        @close="closeModal"
        class="relative z-50 dark:text-white"
        :class="locale === 'fa' ? 'direction-rtl' : 'direction-ltr'"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-900 p-6 align-middle transition-all"
                :class="locale === 'fa' ? 'text-right' : 'text-left'"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 flex justify-between border-b border-gray-2 pb-2"
                >
                  {{ $t('backupCode') }}
                </DialogTitle>
                <div class="mt-8">
                  <p>
                    {{ $t('backupCodeAlert1') }}
                  </p>
                  <p>
                    {{ $t('backupCodeAlert2') }}
                  </p>
                  <div
                    class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-center items-center my-8 overflow-auto"
                  >
                    <BaseIcon name="copy" className="cursor-pointer w-6" @click="useCopy(token)" />
                    <div class="mr-4">{{ token }}</div>
                  </div>
                  <NuxtLink
                    :prefetch="false"
                    class="bg-blue-400 px-6 rounded-full text-center py-2 text-sm font-medium cursor-pointer"
                    :to="$localePath('/dashboard/security/totp/step2')"
                  >
                    {{ $t('iTookNote') }}
                  </NuxtLink>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
