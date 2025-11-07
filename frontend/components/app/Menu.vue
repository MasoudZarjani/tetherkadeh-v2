<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { useMenuStore } from '~/stores/menu'
import { useAuth } from '@/composables/useAuth'

const localePath = useLocalePath()
const { menuOpen } = storeToRefs(useMenuStore())
const { toggleMenu } = useMenuStore()
const { user, logout } = useAuth()

const signOut = () => {
  logout()
  navigateTo(localePath('/auth/login'))
}
</script>
<template>
  <div
    class="absolute w-full left-0 top-0 p-2 bg-slate-50 dark:bg-slate-800 z-40 min-h-screen"
    v-if="menuOpen"
  >
    <div class="py-4 px-2 w-full grid grid-cols-1 gap-8">
      <div class="w-full flex justify-between items-center">
        <BaseIcon name="close" className="w-6 h-6" @click="toggleMenu" />
      </div>
    </div>
    <div class="w-full">
      <NuxtLink
        :to="$localePath('/dashboard/profile')"
        @click="toggleMenu"
        :prefetch="false"
        class="w-full flex justify-between items-center p-2 my-2"
      >
        <div class="w-full">
          <div class="text-sm mb-2 flex justify-between w-full items-center">
            <div>
              {{
                user?.firstName && user?.lastName
                  ? user.firstName + ' ' + user.lastName
                  : user?.mobile || user?.email
              }}
            </div>
          </div>
          <div class="text-sm mb-2"></div>
          <PublicKycStatus />
        </div>
        <div>
          <ChevronLeftIcon class="w-4" />
        </div>
      </NuxtLink>
    </div>
    <div class="p-2 w-full grid grid-cols-1 gap-2">
      <NuxtLink
        class="w-full flex justify-between items-center"
        @click="toggleMenu"
        :to="$localePath('/dashboard/security')"
        :prefetch="false"
      >
        {{ $t('security') }}
        <div>
          <ChevronLeftIcon class="w-4" />
        </div>
      </NuxtLink>
      <NuxtLink
        class="w-full flex justify-between items-center"
        @click="toggleMenu"
        :prefetch="false"
        :to="$localePath('/dashboard/bank-accounts')"
      >
        {{ $t('accounts') }}
        <div>
          <ChevronLeftIcon class="w-4" />
        </div>
      </NuxtLink>
    </div>
    <div>
      <button
        @click="signOut()"
        class="text-red-500 group flex w-full items-center rounded-md px-2 py-4 text-sm"
      >
        {{ $t('logout') }}
      </button>
    </div>
  </div>
</template>
