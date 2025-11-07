<script setup lang="ts">
interface Network {
  _id: string
  slug: string
  isWithdraw: boolean
  withdrawFee: number
  minWithdraw: number
  numberOfDecimal: number
  destinationTag: boolean
  [key: string]: any
}

interface Symbol {
  _id: string
  symbol: string
  networks: Network[]
  [key: string]: any
}

interface Wallet {
  coin: string
  totalUSDT?: number
  totalBlockedUSDT?: number
  [key: string]: any
}

interface TransactionItems {
  wallets?: Wallet[]
  symbols?: Symbol[]
}

const props = defineProps<{
  items: TransactionItems
}>()

// Create reactive reference
const itemsRef = toRef(props, 'items')

const {
  symbol,
  selected,
  amount,
  amountError,
  isLoading,
  isOpen,
  address,
  memo,
  availableBalance,
  receiptAmount,
  setAmount,
  create,
  verify,
} = useWithdrawCrypto(itemsRef)

// Format number helper
const formatNumber = (value: number) => {
  return Intl.NumberFormat('en-US').format(value || 0)
}
</script>

<template>
  <div class="flex flex-col space-y-4">
    <!-- Amount Input -->
    <div>
      <span class="flex justify-end items-center font-medium text-gray-500 text-right text-xs mb-1">
        {{ $t('withdrawable') }}:
        <div class="text-blue-400 mr-2 cursor-pointer" @click="setAmount">
          {{ formatNumber(availableBalance) }} USDT
        </div>
      </span>
      <CoreInputQuantity v-model="amount" :error="amountError" base="USDT" :base-increment="0" />
    </div>

    <!-- Network Selection -->
    <CoreInputSelectNetwork v-model="selected" :items="symbol?.networks" side="withdraw" />

    <!-- Address and Memo Inputs -->
    <template v-if="selected?.isWithdraw">
      <!-- Destination Address -->
      <div class="w-full">
        <label
          for="address"
          class="flex justify-start items-center text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-1"
        >
          {{ $t('destinationAddress') }}
        </label>
        <input
          id="address"
          v-model="address"
          name="address"
          type="text"
          class="block bg-slate-200 direction-ltr dark:bg-slate-700 border border-slate-50 dark:border-slate-900 h-12 w-full appearance-none rounded-lg px-3 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 sm:text-sm"
        />
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t('withdrawAlert') }}
        </span>
      </div>

      <!-- Memo/Destination Tag (if required) -->
      <div v-if="selected.destinationTag" class="w-full">
        <label
          for="memo"
          class="flex justify-start items-center text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-2"
        >
          {{ $t('memo') }}
          <div class="group relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              class="mr-2"
              height="18"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M11 0C12.0098 0 12.9837 0.128906 13.9219 0.386719C14.86 0.644531 15.7337 1.01693 16.543 1.50391C17.3522 1.99089 18.0934 2.5638 18.7666 3.22266C19.4398 3.88151 20.0163 4.62272 20.4961 5.44629C20.9759 6.26986 21.3447 7.14714 21.6025 8.07812C21.8604 9.00911 21.9928 9.98307 22 11C22 12.0098 21.8711 12.9837 21.6133 13.9219C21.3555 14.86 20.9831 15.7337 20.4961 16.543C20.0091 17.3522 19.4362 18.0934 18.7773 18.7666C18.1185 19.4398 17.3773 20.0163 16.5537 20.4961C15.7301 20.9759 14.8529 21.3447 13.9219 21.6025C12.9909 21.8604 12.0169 21.9928 11 22C9.99023 22 9.01628 21.8711 8.07812 21.6133C7.13997 21.3555 6.26628 20.9831 5.45703 20.4961C4.64779 20.0091 3.90658 19.4362 3.2334 18.7773C2.56022 18.1185 1.98372 17.3773 1.50391 16.5537C1.02409 15.7301 0.655273 14.8529 0.397461 13.9219C0.139648 12.9909 0.00716146 12.0169 0 11C0 9.99023 0.128906 9.01628 0.386719 8.07812C0.644531 7.13997 1.01693 6.26628 1.50391 5.45703C1.99089 4.64779 2.5638 3.90658 3.22266 3.2334C3.88151 2.56022 4.62272 1.98372 5.44629 1.50391C6.26986 1.02409 7.14714 0.655273 8.07812 0.397461C9.00911 0.139648 9.98307 0.00716146 11 0ZM12.375 16.5V13.75H9.625V16.5H12.375ZM12.375 12.375V5.5H9.625V12.375H12.375Z"
                fill="#27DEBF"
              />
            </svg>
            <div
              class="absolute bg-white text-black p-4 rounded-lg hidden group-hover:block bottom-6 right-0 w-96 text-xs z-10"
            >
              {{ $t('memoAlert') }}
            </div>
          </div>
        </label>
        <input
          id="memo"
          v-model="memo"
          name="memo"
          type="text"
          class="block direction-ltr bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900 h-12 w-full appearance-none rounded-lg px-3 py-2 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-blue-400 sm:text-sm"
        />
      </div>
    </template>

    <!-- Fee and Receipt Information -->
    <div
      class="flex flex-col w-full gap-2 md:gap-6 rounded bg-slate-200 dark:bg-slate-700 border border-slate-100 dark:border-slate-800 p-2"
    >
      <div class="flex justify-between items-center w-full">
        <div>{{ $t('networkFee') }}</div>
        <div class="direction-ltr">
          {{ useDigitNumber(selected?.withdrawFee, selected?.numberOfDecimal) }} USDT
        </div>
      </div>
      <div class="flex justify-between items-center w-full">
        <div>{{ $t('yourReceipt') }}</div>
        <div class="font-bold direction-ltr">
          {{ useDigitNumber(receiptAmount, selected?.numberOfDecimal) }} USDT
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <CoreBtnDefault
      :is-loading="isLoading"
      :disabled="!selected?.isWithdraw || !amount || !!amountError || !address"
      @click="create"
    >
      {{ $t('withdrawRequest') }}
    </CoreBtnDefault>

    <!-- Verification Modal -->
    <CoreDialogVerifyCode v-model="isOpen" @completed="verify" />
  </div>
</template>
