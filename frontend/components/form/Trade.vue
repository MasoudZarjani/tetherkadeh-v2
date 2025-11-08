<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'

const { showAlert } = useAlertStore()
const api = useApi()
const { t } = useI18n()

interface SymbolData {
  last: number
  high: number
  low: number
  diff24d: number
  buyingPriceGap: number
  sellingPriceGap: number
  sellingPriceGapPercentage: number
  buyingPriceGapPercentage: number
}

const props = defineProps<{
  symbol: SymbolData
}>()
const emit = defineEmits(['refresh'])
const lastBuy =
  (props.symbol.last + props.symbol.buyingPriceGap) *
  (1 + props.symbol.buyingPriceGapPercentage / 100)
const lastSell =
  (props.symbol.last - props.symbol.sellingPriceGap) *
  (1 - props.symbol.sellingPriceGapPercentage / 100)

const selectedTab = ref({
  name: 'خرید تتر',
  key: 'buy',
  current: true,
  status: true,
})

const price = ref('')
const amount = ref('')
const priceError: Ref<string | undefined> = ref(undefined)
const amountError: Ref<string | undefined> = ref(undefined)
const isLoading = ref(false)

watch(
  () => selectedTab,
  () => {
    amount.value = ''
    price.value = ''
  },
  { deep: true }
)

watch(
  () => price,
  newVal => {
    const validationResult = useValidate(newVal.value, 'price')
    priceError.value = validationResult === null ? undefined : validationResult
    nextTick(() => (price.value = useCurrencyValue(newVal.value)))
  },
  { deep: true }
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

let realPrice = computed(() => {
  return +useTrimNumber(price.value?.replace(/,/gi, '')) || 0
})

let realAmount = computed(() => {
  return +useTrimNumber(amount.value?.replace(/,/gi, '')) || 0
})

const changeAmount = () => {
  if (realAmount.value > 0) {
    price.value = (
      +realAmount.value * (selectedTab.value.key === 'buy' ? lastBuy : (lastSell ?? 0))
    ).toString()
  } else {
    price.value = ''
  }
}

const changePrice = () => {
  if (realPrice.value > 0) {
    amount.value = (
      +realPrice.value / (selectedTab.value.key === 'buy' ? lastBuy : (lastSell ?? 0))
    ).toString()
  } else {
    amount.value = ''
  }
}

const trade = async (side: string) => {
  try {
    isLoading.value = true
    const body = {
      amount: realAmount.value,
      side,
    }
    await api.post('/api/v1/order', body)

    showAlert({
      text: t('alert.tradeSuccessfull'),
      color: 'success',
    })
    emit('refresh')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CoreCardDefault class-name="w-full max-w-lg text-lg">
    <CoreInputTabTrade v-model="selectedTab" />
    <hr class="text-slate-300 dark:text-slate-600" />
    <div class="flex flex-col gap-8 mt-4 p-4">
      <CoreInputQuantity
        v-model="amount"
        :error="amountError"
        base="USDT"
        :base-increment="8"
        @input="changeAmount()"
      />
      <CoreInputPrice
        v-model="price"
        :error="priceError"
        base="IRT"
        :placeholder="price"
        :base-increment="0"
        @input="changePrice"
      />
      <span>
        {{ $t('liveUsdtPrice') }}:
        <span class="font-bold text-blue-400">{{
          useDigitNumber(selectedTab.key === 'buy' ? lastBuy : (lastSell ?? 0), 0)
        }}</span>
        {{ $t('tmn') }}
      </span>
      <CoreBtnSuccess
        class="blocked"
        v-if="selectedTab.key === 'buy'"
        @click="trade('Buy')"
        :is-loading="isLoading"
      >
        {{ $t('buyUsdt') }}
      </CoreBtnSuccess>
      <CoreBtnError class="blocked" v-else @click="trade('Sell')" :is-loading="isLoading">
        {{ $t('sellUsdt') }}
      </CoreBtnError>
    </div>
  </CoreCardDefault>
</template>
