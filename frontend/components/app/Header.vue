<script setup lang="ts">
import { headerNavigationLinks, type NavigationLink } from '~/config/navigation'
import { useAuth } from '@/composables/useAuth'
const localePath = useLocalePath()

const { isLoggedIn } = useAuth()
const { site } = await useSiteInfo()

const navigation: NavigationLink[] = headerNavigationLinks

const open = ref(false)
const setOpen = () => {
  open.value = !open.value
}
</script>
<template>
  <div class="w-full sticky top-0 z-50">
    <div
      class="relative flex items-center justify-between w-full bg-slate-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 py-2 md:px-10 px-2"
    >
      <div class="cursor-pointer flex items-center">
        <nuxt-link :to="$localePath('/')" class="flex items-center md:space-x-3 md:space-x-reverse">
          <CoreLogo class="w-12 h-12 rounded-full flex items-center justify-center" />
          <div class="mx-2 hidden md:block">
            <h2 class="text-xl font-bold text-blue-400">
              {{ $t($t(site?.siteName || 'tetherkade')) }}
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('cryptoExchange') }}</p>
          </div>
        </nuxt-link>
        <ul
          class="absolute left-0 z-50 w-full bg-slate-50 dark:bg-slate-800 pb-12 px-6 md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 md:px-0"
          :class="{
            'top-14 transition-all duration-500 ease-in': open,
            'top-[-490px] transition-all duration-500 ease-out': !open,
          }"
        >
          <li class="md:mr-8 md:my-0 my-7" v-for="(item, index) in navigation" :key="index">
            <nuxt-link
              v-if="!item.target"
              :to="$localePath(item.link)"
              :class="{
                'text-blue-400': $route.path === item.link,
              }"
              class="hover:text-blue-400"
              @click="open = false"
            >
              {{ $t('navigation.' + item.title || item.name) }}
            </nuxt-link>
            <a
              v-else
              :href="item.link"
              :target="item.target"
              class="hover:text-blue-400"
              @click="open = false"
            >
              {{ $t('navigation.' + item.title || item.name) }}
            </a>
          </li>
        </ul>
      </div>

      <div class="flex justify-center items-center gap-1 md:gap-2 relative">
        <CoreInputSelectLanguage />
        <CoreBtnDefault @click="navigateTo(localePath('/auth/register'))" v-if="!isLoggedIn">{{
          $t('navigation.signUp')
        }}</CoreBtnDefault>
        <CoreBtnDefault outline @click="navigateTo(localePath('/auth/login'))" v-if="!isLoggedIn">{{
          $t('navigation.signIn')
        }}</CoreBtnDefault>
        <CoreBtnDefault
          outline
          @click="navigateTo(localePath('/dashboard'))"
          v-if="isLoggedIn"
          class="w-48"
          >{{ $t('navigation.dashboard') }}</CoreBtnDefault
        >
        <CoreColorMode />
        <button
          type="button"
          @click="setOpen()"
          class="text-3xl cursor-pointer md:hidden"
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 md:w-10 h-6 md:h-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
