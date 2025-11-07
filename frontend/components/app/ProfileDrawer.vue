<template>
  <div>
    <!-- پس زمینه تار -->
    <div
      v-show="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="closeDrawer"
    ></div>

    <!-- Drawer -->
    <div
      class="fixed top-0 left-0 h-full w-full md:w-80 bg-slate-50 dark:bg-slate-800 shadow-lg z-50 transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
      >
        <NuxtLink
          @click="closeDrawer"
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
        <button @click="closeDrawer" class="text-xl">&times;</button>
      </div>
      <div class="p-4 space-y-4">
        <NuxtLink
          @click="closeDrawer"
          :to="$localePath('/dashboard/profile')"
          class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
        >
          <BaseIcon name="profile" className="w-5 h-5 ml-2" />
          <div>{{ $t('navigation.profile') }}</div>
        </NuxtLink>
        <NuxtLink
          @click="closeDrawer"
          :to="$localePath('/dashboard/bank-accounts')"
          class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
        >
          <BaseIcon name="card" className="w-5 h-5 ml-2" />
          <div>{{ $t('navigation.bankAccounts') }}</div>
        </NuxtLink>
        <NuxtLink
          @click="closeDrawer"
          :to="$localePath('/dashboard/security')"
          class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
        >
          <BaseIcon name="security" className="w-5 h-5 ml-2" />
          <div>{{ $t('navigation.security') }}</div>
        </NuxtLink>
        <div class="border-b border-gray-200 dark:border-gray-600 my-1" />
        <div
          @click="signOut()"
          class="flex justify-start items-center px-6 py-2 cursor-pointer hover:bg-white hover:dark:bg-slate-900 hover:rounded-lg"
        >
          <BaseIcon name="logout" className="w-5 h-5 ml-2 fill-red-500" />
          <div class="text-red-500">{{ $t('navigation.logout') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const localePath = useLocalePath()
const { user, logout } = useAuth()

defineProps({
  isOpen: { type: Boolean, default: false },
})
const emits = defineEmits(['close'])

function closeDrawer() {
  emits('close')
}

const signOut = () => {
  logout()
  navigateTo(localePath('/auth/login'))
}
</script>

<style scoped>
/* نیاز به نصب پلاگین line-clamp در Tailwind */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
