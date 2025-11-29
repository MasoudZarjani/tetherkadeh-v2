<script setup lang="ts">
const { site } = await useSiteInfo()
const localePath = useLocalePath()
const { locale } = useI18n()

const props = defineProps<{ symbol: any; isLoading: boolean }>()

const lastBuy = computed(() => {
  if (!props.symbol) return 0
  return (
    (props.symbol.last + props.symbol.buyingPriceGap) *
    (1 + props.symbol.buyingPriceGapPercentage / 100)
  )
})

const lastSell = computed(() => {
  if (!props.symbol) return 0
  return (
    (props.symbol.last - props.symbol.sellingPriceGap) *
    (1 - props.symbol.sellingPriceGapPercentage / 100)
  )
})
</script>

<template>
  <!-- Hero Section -->
  <section id="home" class="hero-pattern py-20 lg:py-32">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="fade-in">
          <h1
            class="text-4xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight text-center"
            :class="locale === 'fa' ? 'lg:text-right' : 'lg:text-left'"
          >
            {{ $t('cryptoExchange') }} <span class="text-blue-400">{{ $t(site?.siteName) }}</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {{ $t('with') }} {{ $t($t(site?.siteName)) }} {{ $t('slogan') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mb-12">
            <CoreBtnDefault @click="navigateTo(localePath('/dashboard'))">
              {{ $t('startTrading') }}
            </CoreBtnDefault>
          </div>
        </div>

        <div class="fade-in stagger-2">
          <div class="relative">
            <div class="floating">
              <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto relative"
              >
                <div class="text-center mb-6">
                  <div
                    class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <NuxtImg src="/tether-logo.png" alt="لوگو تتر" loading="lazy" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                    {{ $t('liveUsdtPrice') }}
                  </h3>
                </div>

                <div class="space-y-4 mb-6">
                  <div
                    class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span class="text-gray-600 dark:text-gray-300">{{ $t('buy') }}</span>
                    <div>
                      <span class="font-bold text-green-500" id="buyPrice">
                        {{ !props.isLoading ? useDigitNumber(lastBuy, 0) : 0 }}
                      </span>
                      <span class="text-gray-400 text-sm mr-1">{{ $t('tmn') }}</span>
                    </div>
                  </div>
                  <div
                    class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span class="text-gray-600 dark:text-gray-300">{{ $t('sell') }}</span>
                    <div>
                      <span class="font-bold text-red-500" id="sellPrice">
                        {{ !props.isLoading ? useDigitNumber(lastSell, 0) : 0 }}
                      </span>
                      <span class="text-gray-400 text-sm mr-1">{{ $t('tmn') }}</span>
                    </div>
                  </div>
                </div>
                <CoreBtnDefault class="w-full" @click="navigateTo(localePath('/dashboard'))">
                  {{ $t('startTrading') }}
                </CoreBtnDefault>
                <!-- Floating Elements -->
                <div class="absolute -top-4 -right-4 opacity-40 rounded-full animate-pulse">
                  <NuxtImg src="/trx-logo.png" alt="لوگو تتر" loading="lazy" class="w-20 h-20" />
                </div>
                <div class="absolute -bottom-4 -left-4 opacity-40 rounded-full animate-bounce">
                  <NuxtImg src="/bnb-logo.png" alt="لوگو تتر" loading="lazy" class="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
