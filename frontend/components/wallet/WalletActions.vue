<template>
  <div class="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
    <CoreActionButton icon="deposit" :label="$t('deposit')" to="/dashboard/wallet/deposit/crypto" />
    <CoreActionButton icon="withdraw" :label="$t('withdraw')" to="/dashboard/wallet/withdraw/bank" />
    <CoreActionButton icon="trade" :label="$t('transfer')" to="/dashboard" />
    <CoreActionButton
      icon="history"
      :label="$t('history')"
      to="/dashboard/histories/transactions/deposits"
    />
  </div>
</template>
