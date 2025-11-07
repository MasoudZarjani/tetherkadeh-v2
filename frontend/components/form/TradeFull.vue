<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'

const { showAlert } = useAlertStore()
const api = useApi()

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
  type: string
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
      text: 'معامله با موفقیت ثبت گردید.',
      color: 'success',
    })
    emit('refresh')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CoreCardDefault class-name="w-full">
    <h2 class="text-xl font-semibold mb-6 text-center">
      <span :class="type === 'Buy' ? 'text-green-500' : 'text-red-500'">{{
        type === 'Buy' ? $t('buyUsdt') : $t('sellUsdt')
      }}</span>
    </h2>
    <div class="space-y-8">
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
        placeholder="price"
        :base-increment="0"
        @input="changePrice"
      />
      <div
        class="flex justify-between w-full items-center p-3 rounded-lg dark:bg-opacity-30"
        :class="type === 'Buy' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'"
      >
        <div>
          {{ $t('rate') }} <span v-if="type === 'Buy'">{{ $t('buy') }}</span> <span v-else>{{ $t('sell') }}</span
          >:
        </div>
        <div>
          <strong>{{ useDigitNumber(type === 'Buy' ? lastBuy : (lastSell ?? 0), 0) }}</strong>
          {{ $t('tmn') }}
        </div>
      </div>
      <CoreBtnSuccess
        class="w-full"
        v-if="type === 'Buy'"
        @click="trade('Buy')"
        :is-loading="isLoading"
      >
        {{ $t('buyUsdt') }}
      </CoreBtnSuccess>
      <CoreBtnError class="w-full" v-else @click="trade('Sell')" :is-loading="isLoading">
        {{ $t('sellUsdt') }}
      </CoreBtnError>
    </div>
  </CoreCardDefault>
</template>
