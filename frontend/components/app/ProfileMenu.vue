<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useMenuStore } from '~/stores/menu'
import { useAuth } from '@/composables/useAuth'

const { user, logout } = useAuth()
const { t } = useI18n()
const router = useRouter()
const { toggleMenu } = useMenuStore()
const localePath = useLocalePath()

const menus = [
  { name: t('profile'), to: '/dashboard/profile' },
  { name: t('accounts'), to: '/dashboard/bank-accounts' },
  { name: t('security'), to: '/dashboard/security' },
]

const signOut = () => {
  logout()
  navigateTo(localePath('/auth/login'))
}
</script>
<template>
  <div class="text-right flex justify-center items-center">
    <!-- <CoreColorMode class="hidden lg:flex" /> -->
    <Menu as="div" class="relative hidden lg:inline-block text-left lg:h-10">
      <div>
        <MenuButton>
          <div class="flex justify-center items-start min-w-44 max-w-64">
            <div class="w-8 lg:w-10 shrink-0 mx-2 cursor-pointer">
              <BaseIcon name="profile" className="w-8 h-8" fill="#155dfc" />
            </div>
            <div class="ml-4 hidden lg:block">
              <div class="text-sm cursor-pointer">
                {{
                  user?.firstName && user?.lastName
                    ? user.firstName + ' ' + user.lastName
                    : user?.mobile || user?.email
                }}
              </div>
              <PublicKycStatus />
            </div>
          </div>
        </MenuButton>
      </div>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="absolute border z-20 border-gray-200 dark:border-gray-700 left-0 w-64 p-1 shadow-md shadow-gray-500/50 rounded-md bg-slate-50 dark:bg-slate-800 backdrop-blur backdrop-filter focus-visible:outline-none focus-visible:ring"
        >
          <div class="flex lg:hidden justify-between items-center">
            <div class="p-2 text-right">
              <div class="text-sm">
                {{
                  user?.firstName && user?.lastName
                    ? user.firstName + ' ' + user.lastName
                    : user?.mobile || user?.email
                }}
              </div>
              <PublicKycStatus />
            </div>
            <!-- <CoreColorMode /> -->
          </div>
          <div class="p-1">
            <MenuItem
              v-slot="{ active }"
              v-for="(item, index) in menus"
              :key="index"
              class="cursor-pointer"
            >
              <button
                @click="router.push(item.to)"
                :class="[
                  active ? 'text-blue-400 dark:text-white' : 'dark:text-white',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm hover:text-blue-400',
                ]"
              >
                {{ item.name }}
              </button>
            </MenuItem>
          </div>
          <div class="p-1">
            <MenuItem v-slot="{ active }" class="cursor-pointer">
              <button
                @click="signOut()"
                :class="[
                  active ? 'bg-red-500 dark:text-white' : 'text-red-500',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                {{ $t('logout') }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    <div class="w-8 lg:w-10 shrink-0 mx-2 lg:hidden" @click="toggleMenu">
      <BaseIcon name="profile" className="w-8 h-8" fill="#155dfc" />
    </div>
  </div>
</template>
