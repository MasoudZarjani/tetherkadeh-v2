<script setup lang="ts">
import { useWallet } from '~/composables/useWallet'

const { site } = await useSiteInfo()

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard',
  breadcrumbs: 'کیف پول',
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | کیف پول`,
  description: `${site.value?.siteName} | صرافی امن و سریع...`,
  ogImage: 'https://tetherkade.com/logo.png',
})

const { loading, usdtWallet, irtWallet } = useWallet()
</script>

<template>
  <div class="container mx-auto px-4 py-4" v-if="!loading">
    <div class="mb-4 md:mb-8">
      <h1 class="text-3xl font-bold">{{ $t('accountBalance') }}</h1>
      <p class="text-gray-500">{{ $t('assetManagement') }}</p>
    </div>

    <!-- Overview + Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 md:gap-4 mb-4">
      <Suspense>
        <template #default>
          <WalletOverview :usdtWallet="usdtWallet" :irtWallet="irtWallet" />
        </template>
        <template #fallback><SkeletonWallet /></template>
      </Suspense>

      <WalletActions class="mt-4 md:mt-0" />
    </div>

    <!-- Detailed Balances -->
    <div class="grid md:grid-cols-2 gap-4">
      <WalletBalanceCard
        :title="$t('tether') + '(USDT)'"
        :subtitle="$t('cryptoCurrency')"
        icon="/tether-logo.png"
        alt="لوگو تتر"
        currency="USDT"
        :fiatCurrency="$t('tmn')"
        :balance="usdtWallet.totalDepositUSDT"
        :fiatEquivalent="usdtWallet.totalDepositIRT"
        :available="
          usdtWallet.totalDepositUSDT - (usdtWallet.totalWithdrawUSDT + usdtWallet.totalBlockedUSDT)
        "
        :blocked="usdtWallet.totalWithdrawUSDT + usdtWallet.totalBlockedUSDT"
        withdrawUrl="/dashboard/wallet/withdraw/crypto"
        depositUrl="/dashboard/wallet/deposit/crypto"
        :digits="4"
      />

      <WalletBalanceCard
        :title="$t('tmn') + '(TMN)'"
        :subtitle="$t('irtTmn')"
        icon="/irt.svg"
        alt="لوگو تومان"
        :currency="$t('tmn')"
        fiatCurrency="USDT"
        :balance="irtWallet.totalDepositIRT"
        :fiatEquivalent="irtWallet.totalDepositUSDT"
        :available="irtWallet.totalIRT - (irtWallet.totalWithdrawIRT + irtWallet.totalBlockedIRT)"
        :blocked="irtWallet.totalWithdrawIRT + irtWallet.totalBlockedIRT"
        withdrawUrl="/dashboard/wallet/withdraw/bank"
        depositUrl="/dashboard/wallet/deposit/bank"
        :digits="0"
      />
    </div>
  </div>
</template>
