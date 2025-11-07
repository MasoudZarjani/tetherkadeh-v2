<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-linear-to-r from-slate-50 to-slate-100 border-t border-slate-200 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 shadow-lg z-50 py-1"
  >
    <div class="relative overflow-hidden h-6">
      <!-- مسیر حرکت -->
      <div
        class="absolute top-0 left-0 flex items-center space-x-8 nowrap"
        :style="{
          transform: `translateX(${scrollPosition}px)`,
          willChange: 'transform',
        }"
      >
        <!-- بلوک اصلی -->
        <div
          v-for="(crypto, index) in cryptos"
          :key="'crypto-' + index"
          class="flex items-center space-x-2 shrink-0"
        >
          <NuxtImg
            :src="crypto.logo"
            loading="lazy"
            :alt="crypto.name"
            class="w-6 h-6 rounded-full"
          />
          <span class="font-semibold text-sm">{{ crypto.symbol.toUpperCase() }}</span>
          <span class="text-green-500 text-sm">${{ formatPrice(crypto.price) }}</span>
          <span
            :class="crypto.change24h || 0 >= 0 ? 'text-green-500' : 'text-red-500'"
            class="text-xs"
          >
            {{ crypto.change24h || 0 >= 0 ? '↑' : '↓' }}
            {{ Math.abs(crypto.change24h || 0).toFixed(2) }}%
          </span>
        </div>

        <!-- بلوک تکراری برای انیمیشن بی‌نهایت -->
        <div
          v-for="(crypto, index) in cryptos"
          :key="'clone-' + index"
          class="flex items-center space-x-2 shrink-0"
        >
          <NuxtImg
            loading="lazy"
            :src="crypto.logo"
            :alt="crypto.name"
            class="w-6 h-6 rounded-full"
          />
          <span class="font-semibold text-sm">{{ crypto.symbol.toUpperCase() }}</span>
          <span class="text-green-500 text-sm">${{ formatPrice(crypto.price) }}</span>
          <span
            :class="crypto.change24h || 0 >= 0 ? 'text-green-500' : 'text-red-500'"
            class="text-xs"
          >
            {{ crypto.change24h || 0 >= 0 ? '↑' : '↓' }}
            {{ Math.abs(crypto.change24h || 0).toFixed(2) }}%
          </span>
        </div>
      </div>

      <!-- اسکلت بارگذاری -->
      <div v-if="loading" class="flex space-x-8">
        <div v-for="n in 5" :key="'skeleton-' + n" class="flex items-center space-x-2 shrink-0">
          <div class="w-6 h-6 rounded-full bg-gray-700 animate-pulse"></div>
          <div class="h-4 w-12 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 w-10 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ---- Types ----
interface Crypto {
  symbol: string
  name: string
  logo: string
  price?: number
  change24h?: number
}

// ---- Refs ----
const cryptos = ref<Crypto[]>([])
const loading = ref<boolean>(true)
const scrollPosition = ref<number>(0)
const animationFrameId = ref<number | null>(null)
const intervalId = ref<number | null>(null)
const itemWidth = 180 // عرض تقریبی هر آیتم

// ---- لیست ارزهای پیش‌فرض ----
const defaultCryptos: Crypto[] = [
  {
    symbol: 'btc',
    name: 'Bitcoin',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/btc.svg',
  },
  {
    symbol: 'eth',
    name: 'Ethereum',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/eth.svg',
  },
  {
    symbol: 'bnb',
    name: 'Binancecoin',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/bnb.svg',
  },
  {
    symbol: 'xrp',
    name: 'Ripple',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/xrp.svg',
  },
  {
    symbol: 'sol',
    name: 'Solana',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/sol.svg',
  },
  {
    symbol: 'doge',
    name: 'Dogecoin',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/doge.svg',
  },
  {
    symbol: 'trx',
    name: 'TRON',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/trx.svg',
  },
  {
    symbol: 'ada',
    name: 'Cardano',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/ada.svg',
  },
  {
    symbol: 'link',
    name: 'Chainlink',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/link.svg',
  },
  {
    symbol: 'bch',
    name: 'Bitcoin-Cash',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/bch.svg',
  },
  {
    symbol: 'avax',
    name: 'Avalanche-2',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/avax.svg',
  },
  {
    symbol: 'dot',
    name: 'Polkadot',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/dot.svg',
  },
  {
    symbol: 'uni',
    name: 'Uniswap',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/uni.svg',
  },
  {
    symbol: 'pol',
    name: 'Polygon',
    logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/matic.svg',
  },
]

// ---- Helpers ----
const formatPrice = (price: number | undefined): string => {
  if (price === undefined) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// ---- API Fetch ----
const fetchPrices = async (): Promise<void> => {
  try {
    loading.value = true
    const ids = defaultCryptos.map(c => c.name.toLowerCase()).join(',')
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    )
    const data = await response.json()

    cryptos.value = defaultCryptos.map(crypto => {
      const entry = data[crypto.name.toLowerCase()]
      return {
        ...crypto,
        price: entry?.usd ?? 0,
        change24h: entry?.usd_24h_change ?? 0,
      }
    })
  } catch (err) {
    console.error('Error fetching crypto prices:', err)
    cryptos.value = defaultCryptos.map(c => ({ ...c, price: 0, change24h: 0 }))
  } finally {
    loading.value = false
  }
}

// ---- Infinite Animation ----
const startInfiniteAnimation = (): void => {
  const totalWidth = cryptos.value.length * itemWidth

  const animate = (): void => {
    scrollPosition.value -= 0.5
    if (-scrollPosition.value >= totalWidth) scrollPosition.value = 0
    animationFrameId.value = requestAnimationFrame(animate)
  }

  animate()
}

// ---- Lifecycle ----
onMounted(() => {
  fetchPrices()

  const initAnimation = (): void => {
    if (cryptos.value.length > 0 && !animationFrameId.value) {
      startInfiniteAnimation()
    } else {
      setTimeout(initAnimation, 100)
    }
  }
  initAnimation()

  intervalId.value = window.setInterval(fetchPrices, 60000)
})

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value)
  if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value)
})
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
