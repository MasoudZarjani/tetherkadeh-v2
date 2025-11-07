<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import { nextTick } from 'vue'

interface TransactionItems {
  symbols: any[]
}

const props = defineProps<{
  items: TransactionItems
}>()

const { t } = useI18n()
const api = useApi()
const { showAlert } = useAlertStore()

const items = toRef(props, 'items')
const symbol: any = ref()
let selected: any = ref()
const amount = ref('')
const amountError = ref<string | undefined>(undefined)
const isLoading = ref(false)
const txid = ref('')

let realAmount = computed(() => {
  return amount.value.replace(/,/gi, '')
})

onMounted(() => {})

watch(
  () => items.value,
  newVal => {
    symbol.value = newVal?.symbols.find((item: any) => item.symbol === 'USDT')
    selected.value = symbol.value?.networks[0] || []
  }
)

watch(
  () => amount,
  newVal => {
    const validationResult = useValidate(newVal.value, 'amount')
    amountError.value = validationResult === null ? undefined : validationResult
    nextTick(() => (amount.value = useCurrencyValue(newVal.value)))
  },
  { deep: true }
)

const addPayment = async () => {
  try {
    isLoading.value = true
    if (+realAmount.value < selected.value.minDeposit) {
      showAlert({
        text: t('alert.minDepositError'),
        color: 'error',
      })
      return
    } else {
      const body = {
        amount: +realAmount.value,
        coin: 'USDT',
        network: selected.value._id,
        transactionId: txid.value,
      }
      await api.post('/api/v1/wallet/deposit', body)
      showAlert({
        text: t('alert.depositSuccess'),
        color: 'success',
      })

      amount.value = ''
      txid.value = ''
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4">
    <CoreInputQuantity v-model="amount" :error="amountError" base="USDT" :base-increment="0" />
    <CoreInputSelectNetwork v-model="selected" :items="symbol?.networks" side="deposit" />
    <div class="flex justify-between items-center w-full text-blue-400">
      <div>{{ $t('minDeposit') }}</div>
      <div class="direction-ltr">{{ selected?.minDeposit }} USDT</div>
    </div>
    <div
      class="flex justify-between items-center w-full h-24 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900"
    >
      <div class="text-lg font-bold mr-2"></div>
      <div class="text-lg font-bold ml-2" v-if="+realAmount >= 10">
        {{ Intl.NumberFormat('en-US').format(+realAmount) }} USDT
      </div>
      <div v-else class="text-3xl font-bold ml-2">0 USDT</div>
    </div>
    <CoreInputAddress :address="selected?.address" :label="$t('depositWalletAddress')" />
    <CoreInputAddress
      v-if="selected?.destinationTag"
      :address="selected?.destinationTag"
      :label="$t('memoLabel')"
    >
      <span class="text-xs text-yellow-500 w-full">{{ $t('memoHint') }}</span>
    </CoreInputAddress>
    <div class="w-full">
      <div>
        <label
          for="address"
          class="flex justify-start items-center text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-1"
        >
          TXID
        </label>
        <textarea
          rows="5"
          name="address"
          id="address"
          v-model="txid"
          class="block bg-slate-200 direction-ltr dark:bg-slate-700 border border-slate-50 dark:border-slate-900 w-full appearance-none rounded-lg px-3 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 sm:text-sm"
        />
      </div>
    </div>
    <CoreBtnDefault @click="addPayment" :is-loading="isLoading" :disabled="!txid">
      {{ $t('submitDeposit') }}
    </CoreBtnDefault>
  </div>
</template>
