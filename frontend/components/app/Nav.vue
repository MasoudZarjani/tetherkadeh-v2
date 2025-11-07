<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { locale } = useI18n()
const { isLoggedIn, user, logout } = useAuth()
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const isDrawerOpen = ref(false)
const navigation = [
  {
    name: t('dashboard'),
    icon: 'dashboard',
    path: 'dashboard',
    to: '/dashboard',
  },
  {
    name: t('trade'),
    icon: 'trade',
    path: 'trade',
    to: '/dashboard/trade',
  },
  {
    name: t('referral'),
    icon: 'referral',
    path: 'referral',
    to: '/dashboard/referral',
  },
  {
    name: t('navigation.blog'),
    icon: 'blog',
    path: 'blog',
    to: '/blog',
  },
  {
    name: t('navigation.wages'),
    icon: 'wage',
    path: 'wage',
    to: '/wages',
  },
  {
    name: t('navigation.contactUs'),
    icon: 'contactUs',
    path: 'contact-us',
    to: '/contact-us',
  },
]

const isRouteActive = computed(() => {
  if (route.path === '/') {
    return false
  } else {
    return false
  }
})

const { usdtWallet, irtWallet } = useWallet()

const signOut = () => {
  logout()
  navigateTo(localePath('/auth/login'))
}
</script>

<template>
  <nav
    class="flex bg-slate-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 h-16 justify-between items-center"
  >
    <ul class="flex space-x-6 items-center">
      <li class="flex items-center">
        <NuxtLink :to="$localePath('/')" :prefetch="false">
          <CoreLogo class="w-10 lg:mx-2" />
        </NuxtLink>
      </li>
      <span v-for="(item, index) in navigation" :key="index" class="hidden md:flex">
        <li>
          <nuxt-link
            :to="$localePath(item.to)"
            class="py-2 px-3 block hover:text-blue-400"
            :class="{ active: isRouteActive }"
            exact-active-class="active"
            active-class="active"
          >
            <span>{{ item.name }}</span>
          </nuxt-link>
        </li>
      </span>
    </ul>
    <div class="flex items-center h-full" v-if="isLoggedIn">
      <CoreInputSelectLanguage />
      <CoreColorMode />
      <!-- <CoreNotifications /> -->
      <div class="relative px-2">
        <BaseIcon name="bell" className="w-6 h-6 cursor-pointer" @click="isDrawerOpen = true" />
        <span class="absolute flex size-3 top-0 right-0 -mt-1">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
          ></span>
          <span class="relative inline-flex size-3 rounded-full bg-red-500"></span>
        </span>
      </div>
      <AppAnnouncementDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false" />
      <!-- Wallet -->
      <div class="hidden md:block relative z-40 group">
        <button
          type="button"
          class="dropdown-toggle py-2 px-3 flex items-center gap-2 rounded cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800"
        >
          <BaseIcon name="wallet" className="w-6 h-6" />
        </button>
        <div
          :class="locale === 'fa' ? 'left-0' : 'right-0'"
          class="dropdown-menu shadow absolute hidden group-hover:block bg-slate-50 dark:bg-slate-800 rounded-b-lg min-w-64 p-2"
        >
          <NuxtLink
            :to="$localePath('/dashboard/wallet')"
            class="flex justify-between items-start p-2 w-full cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <div class="text-gray-400 text-sm">{{ $t('totalAssets') }}</div>
            <div class="text-sm flex flex-col items-end w-full">
              <div class="w-full text-left">
                {{ useDigitNumber(usdtWallet.totalIRT + irtWallet.totalIRT, 0) }} {{ $t('tmn') }}
              </div>
              <div class="w-full text-left">
                {{ useDigitNumber(usdtWallet.totalUSDT + irtWallet.totalUSDT, 2) }} $
              </div>
            </div>
          </NuxtLink>
          <div class="flex justify-between items-center w-full py-2 px-6">
            <NuxtLink
              :to="$localePath('/dashboard/wallet/deposit/bank')"
              class="rounded-full w-12 h-12 bg-white dark:bg-slate-900 flex justify-center items-center"
            >
              <BaseIcon
                name="deposit"
                fill="currentColor"
                className="w-6 h-6 m-2 fill-slate-800 dark:fill-slate-200"
              />
            </NuxtLink>
            <NuxtLink
              :to="$localePath('/dashboard/wallet/withdraw/bank')"
              class="rounded-full w-12 h-12 bg-white dark:bg-slate-900 flex justify-center items-center"
            >
              <BaseIcon
                name="withdraw"
                fill="currentColor"
                className="w-6 h-6 m-2 fill-slate-800 dark:fill-slate-200"
              />
            </NuxtLink>
          </div>
          <div class="border-b border-gray-200 dark:border-gray-600 my-1" />
          <NuxtLink
            :to="$localePath('/dashboard/wallet')"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="wallet-primary" className="w-6 h-6 mx-2" />
            <div>{{ $t('navigation.wallet') }}</div>
          </NuxtLink>
          <div class="border-b border-gray-200 dark:border-gray-600 my-1" />
          <NuxtLink
            :to="$localePath('/dashboard/histories/transactions/deposits')"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="history" className="w-6 h-6 mx-2" />
            <div>{{ $t('navigation.historyTransactions') }}</div>
          </NuxtLink>
          <NuxtLink
            :to="$localePath('/dashboard/histories/orders')"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="history-1" className="w-6 h-6 mx-2" />
            <div>{{ $t('navigation.historyOrders') }}</div>
          </NuxtLink>
        </div>
      </div>
      <!-- User Profile -->
      <div class="hidden md:block relative z-40 group">
        <button
          type="button"
          class="dropdown-toggle py-2 px-3 flex items-center gap-2 rounded cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800"
        >
          <BaseIcon name="profile" className="w-6 h-6" />
        </button>
        <div
          :class="locale === 'fa' ? 'left-0' : 'right-0'"
          class="dropdown-menu shadow absolute hidden group-hover:block bg-slate-50 dark:bg-slate-800 rounded-b-lg min-w-64 p-2"
        >
          <NuxtLink
            :to="$localePath('/dashboard/profile')"
            class="flex flex-col justify-start items-start px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <div>
              {{ (user?.firstName || '') + (user?.lastName || '') || user?.mobile || user?.email }}
            </div>
            <div class="text-gray-400 flex justify-start items-center w-full">
              UID: {{ user?.uid }}
            </div>
          </NuxtLink>
          <div class="border-b border-gray-200 dark:border-gray-600 my-1" />
          <NuxtLink
            :to="$localePath('/dashboard/bank-accounts')"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="card" className="w-6 h-6 mx-2" />
            <div>{{ $t('navigation.bankAccounts') }}</div>
          </NuxtLink>
          <NuxtLink
            :to="$localePath('/dashboard/security')"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="security" className="w-6 h-6 mx-2" />
            <div>{{ $t('navigation.security') }}</div>
          </NuxtLink>
          <div class="border-b border-gray-200 dark:border-gray-600 my-1" />
          <div
            @click="signOut()"
            class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
          >
            <BaseIcon name="logout" className="w-6 h-6 mx-2 fill-red-500" />
            <div class="text-red-500">{{ $t('navigation.logout') }}</div>
          </div>
        </div>
      </div>
      <!-- User Profile Mobile -->
      <div class="block md:hidden">
        <BaseIcon name="profile" className="w-6 h-6 cursor-pointer" @click="isDrawerOpen = true" />
        <div class="relative px-2"></div>
        <AppProfileDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false" />
      </div>
    </div>
    <div class="flex items-center gap-2 h-full" v-else>
      <CoreColorMode />
      <CoreBtnDefault outline @click="$router.push('/auth/login')">{{
        $t('navigation.signIn')
      }}</CoreBtnDefault>
      <CoreBtnDefault @click="$router.push('/auth/register')">{{
        $t('navigation.signUp')
      }}</CoreBtnDefault>
    </div>
  </nav>
</template>

<style scoped>
.active {
  color: #155dfc;
}
</style>
