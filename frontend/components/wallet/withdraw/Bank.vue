<script setup lang="ts">
interface BankAccount {
  _id: string
  [key: string]: any
}

interface Wallet {
  coin: string
  totalIRT: number
  totalBlockedIRT: number
  [key: string]: any
}

interface TransactionItems {
  bankAccounts?: {
    data: BankAccount[]
  }
  wallets?: Wallet[]
}

const props = defineProps<{
  items: TransactionItems
}>()

// Create reactive reference
const itemsRef = toRef(props, 'items')

const {
  selected,
  amount,
  amountError,
  isLoading,
  isOpen,
  fee,
  availableBalance,
  receiptAmount,
  setAmount,
  create,
  verify,
} = useWithdrawBank(itemsRef)

// Format number helper
const formatNumber = (value: number) => {
  return Intl.NumberFormat('en-US').format(value || 0)
}
</script>

<template>
  <div class="flex flex-col space-y-4">
    <!-- Verification Modal -->
    <CoreDialogVerifyCode v-model="isOpen" @completed="verify" />

    <!-- Amount Input -->
    <div>
      <span class="flex justify-end items-center font-medium text-gray-500 text-right text-xs mb-1">
        {{ $t('withdrawable') }}:
        <div class="text-blue-400 mr-2 cursor-pointer" @click="setAmount">
          {{ formatNumber(availableBalance) }} IRT
        </div>
      </span>
      <CoreInputAmount v-model="amount" :error="amountError" base="IRT" :base-increment="0" />
    </div>

    <!-- Bank Account Selection -->
    <CoreInputSelectSheba v-model="selected" :items="items?.bankAccounts?.data" />

    <!-- Fee and Receipt Information -->
    <div
      class="flex flex-col w-full gap-2 md:gap-6 rounded bg-slate-200 dark:bg-slate-700 border border-slate-100 dark:border-slate-800 p-2"
    >
      <div class="flex justify-between items-center w-full">
        <div>{{ $t('bankFee') }}</div>
        <div class="direction-ltr">{{ formatNumber(fee) }} IRT</div>
      </div>
      <div class="flex justify-between items-center w-full">
        <div>{{ $t('yourReceipt') }}</div>
        <div class="font-bold direction-ltr">{{ formatNumber(receiptAmount) }} IRT</div>
      </div>
    </div>

    <!-- Submit Button -->
    <CoreBtnDefault
      :is-loading="isLoading"
      :disabled="!selected || !amount || !!amountError"
      @click="create"
    >
      {{ $t('withdrawRequest') }}
    </CoreBtnDefault>
  </div>
</template>
