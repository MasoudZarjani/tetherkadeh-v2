<script setup lang="ts">
const Menus = [
  {
    name: 'home',
    icon: 'dashboard',
    dis: 'translate-x-32',
    path: '/dashboard',
  },
  {
    name: 'transactions',
    icon: 'history',
    dis: 'translate-x-16',
    path: '/dashboard/histories/transactions/deposits',
  },
  {
    name: 'trade',
    icon: 'trade',
    dis: 'translate-x-0',
    path: '/dashboard/trade',
  },
  {
    name: 'wallet',
    icon: 'wallet',
    dis: '-translate-x-16',
    path: '/dashboard/wallet',
  },
  {
    name: 'bankAccount',
    icon: 'card',
    dis: '-translate-x-32',
    path: '/dashboard/bank-accounts',
  },
]

const active = ref(0)

const setActive = (index: number) => {
  active.value = index
}
</script>
<template>
  <div
    id="app"
    class="bg-slate-200 dark:bg-slate-700 max-h-12 fixed bottom-0 left-0 z-50 w-full rounded-t-xl direction-rtl"
  >
    <ul class="flex relative w-full justify-center">
      <span
        class="bg-blue-400 h-14 w-14 absolute border-4 border-gray-200 dark:border-gray-700 -top-7 rounded-full z-10 duration-500"
        :class="Menus[active].dis"
      ></span>
      <li v-for="(menu, i) in Menus" :key="i" class="w-16">
        <nuxt-link
          :to="$localePath(menu.path)"
          class="flex flex-col text-center py-2"
          @click="setActive(i)"
        >
          <span
            class="text-xl cursor-pointer duration-500 z-20 text-center flex justify-center"
            :class="active === i && '-mt-5 text-white dark:text-black'"
          >
            <BaseIcon
              :name="menu.icon"
              className="w-6 h-6"
              :fill="active === i ? '#FFFFFF' : '#0084FF'"
            />
          </span>
          <span
            class="text-blue-400"
            :class="
              active === i ? 'translate-y-4 duration-700 opacity-100' : 'opacity-0 translate-y-10'
            "
            >{{ $t(menu.name) }}</span
          >
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
