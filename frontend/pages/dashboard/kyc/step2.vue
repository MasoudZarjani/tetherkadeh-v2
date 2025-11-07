<script setup lang="ts">
const api = useApi()
const { site } = await useSiteInfo()
  const localePath = useLocalePath()

definePageMeta({
  requiresAuth: true,
  breadcrumbs: 'احراز هویت',
  layout: 'dashboard',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | احراز هویت مرحله سوم`,
  ogTitle: `صرافی ${site.value?.siteName} | احراز هویت مرحله سوم`,
  description: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی | ${site.value?.siteName}`,
  ogDescription: `خرید و فروش انواع ارزهای دیجیتال با احراز هویت فوری | امن ترین پلتفرم و صرافی ارز دیجیتال با تنوع بازارهای معاملاتی | ${site.value?.siteName}`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

onMounted(() => {
  getBankAccount()
})

const getBankAccount = async () => {
  const data: any = await api.get('/api/v1/bank-account/user?page=1&limit=50&sort=1')
  if (data.total > 0) navigateTo(localePath('/dashboard/kyc/step3'))
}

let cardNumber = ref('')

watch(
  () => cardNumber,
  newVal => {
    let realNumber = newVal.value.replace(/-/gi, '')
    let dashedNumber = realNumber.match(/.{1,4}/g)
    newVal.value = useTrimNumber(dashedNumber?.join('-')) || ''
  },
  { deep: true }
)

const addBankAccount = async () => {
  let realNumber = cardNumber.value.replace(/-/gi, '')
  const payload = {
    cardNumber: realNumber,
  }
  await api.post('/api/v1/bank-account/add', payload)
  navigateTo(localePath('/dashboard/kyc/step3'))
}
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-2 lg:py-4">
    <CoreStep :step="3" />
    <CoreCardDefault class="p-2 lg:p-6 mt-8">
      <div class="flex justify-between items-center">
        <input
          name="cardNumber"
          id="cardNumber"
          type="text"
          placeholder="شماره کارت بانکی"
          v-model="cardNumber"
          maxlength="19"
          pattern="[0-9]*"
          inputmode="numeric"
          class="rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
        />
        <CoreBtnDefault class="mr-2" @click="addBankAccount">ثبت کارت بانکی</CoreBtnDefault>
      </div>
    </CoreCardDefault>
  </div>
</template>
