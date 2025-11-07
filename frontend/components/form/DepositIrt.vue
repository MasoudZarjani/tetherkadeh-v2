<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import { nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { UserStatus } from '~/types/user.types'

interface TransactionItems {
  bankAccounts: any
}

const props = defineProps<{
  items: TransactionItems
}>()

const api = useApi()
const { site } = await useSiteInfo()
const { t } = useI18n()
const { user } = useAuth()
const { showAlert } = useAlertStore()

const items = toRef(props, 'items')
let selected: any = ref({})
const amount = ref('')
const amountError = ref<string | undefined>(undefined)
const isLoading = ref(false)

let realAmount = computed(() => {
  return amount.value.replace(/,/gi, '')
})

const fee = computed(() => {
  const calc = (Number(realAmount.value) * 1) / 100
  if (calc > 8000) return 8000
  else return calc
})

watch(
  () => amount,
  newVal => {
    const validationResult = useValidate(newVal.value, 'amount')
    amountError.value = validationResult === null ? undefined : validationResult
    nextTick(() => (amount.value = useCurrencyValue(newVal.value)))
  },
  { deep: true }
)

watch(
  () => items.value,
  newVal => {
    selected.value = newVal?.bankAccounts?.data[0]
  }
)

const addPayment = async () => {
  try {
    isLoading.value = true
    if (!site.value?.activeGateway) {
      showAlert({ text: t('alert.gatewayClosed'), color: 'error' })
      return
    }
    if (user.value?.status !== UserStatus.Approved && user.value?.status !== UserStatus.Trusted) {
      showAlert({ text: t('alert.authenticateRequired'), color: 'error' })
      return
    } else if (+realAmount.value < 500000) {
      showAlert({
        text: t('alert.minDepositTomanError'),
        color: 'error',
      })
      return
    } else if (+realAmount.value > 25000000) {
      showAlert({
        text: t('alert.maxDepositTomanError'),
        color: 'error',
      })
      return
    } else {
      const body = {
        amount: +realAmount.value,
        coin: 'IRT',
        bankAccount: selected.value._id,
      }
      const data: any = await api.post('/api/v1/wallet/payment', body)
      window.location.href = data.url
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4">
    <CoreInputAmount v-model="amount" :error="amountError" base="IRT" :base-increment="0" />
    <CoreInputSelectCard v-model="selected" :items="items?.bankAccounts?.data" />
    <div class="flex justify-between items-center w-full">
      <div>{{ $t('depositFee') }}</div>
      <div>{{ fee }} IRT</div>
    </div>
    <div
      class="flex justify-between items-center w-full h-24 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900"
    >
      <div class="text-lg font-bold mx-2">{{ $t('depositAmountToWallet') }}</div>
      <div class="text-lg font-bold mx-2" v-if="+realAmount >= 100000">
        {{ Intl.NumberFormat('en-US').format(+realAmount) }} IRT
      </div>
      <div v-else class="text-3xl font-bold mx-2">0 IRT</div>
    </div>
    <CoreBtnDefault :disabled="!site?.activeGateway" @click="addPayment" :is-loading="isLoading">
      {{ $t('goToGateway') }}
    </CoreBtnDefault>
  </div>
</template>
