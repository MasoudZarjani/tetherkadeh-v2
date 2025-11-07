<script lang="ts" setup>
import type { Transaction } from '~/types/transactions.types'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const{locale} = useI18n();

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['changePage'])

const page: any = toRef(props, 'page')
const limit: any = toRef(props, 'limit')
const total: any = toRef(props, 'total')

const prevPage = () => {
  if (page.value > 1) {
    emit('changePage', page.value - 1)
  }
}

const nextPage = () => {
  if (page.value < Math.ceil(total.value / limit.value)) {
    emit('changePage', page.value + 1)
  }
}
</script>

<template>
  <div class="overflow-auto md:rounded-lg p-1">
    <table class="min-w-full hidden lg:table">
      <thead>
        <tr>
          <th
            scope="col"
            class="text-center text-xs lg:text-sm font-semibold pt-2"
            v-for="(header, index) in headers"
            :key="index"
          >
            <span
              class="bg-slate-200 dark:bg-slate-700 py-1 lg:py-3.5 px-1 lg:px-4 border-l border-gray-200 dark:border-gray-700 h-12 inline-flex items-center w-full justify-center"
            >
              {{ $t(header as string) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="index"
          v-if="!loading"
          class="border-b border-gray-200 dark:border-gray-700"
        >
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            <span v-if="locale === 'fa'">{{ useJalaliDate(item?.createdAt) }}</span>
            <span>{{ new Date(item?.createdAt).toLocaleString() }}</span>
          </td>
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            {{ item.coin }}
          </td>
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            <span :class="item.type === 'Withdraw' ? 'text-red-500' : 'text-green-500'">
              {{ useDigitNumber(item.amount, 8) }}
            </span>
          </td>
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            {{ item?.transactionId }}
          </td>
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            {{ item?.reason }}
          </td>
          <td
            class="whitespace-nowrap py-4 pl-4 pr-3 text-xs lg:text-sm font-medium sm:pl-6 text-center"
          >
            <span :class="useStatusColor(item.status)" class="px-2 py-1 rounded text-xs">
              {{ $t(item.status.toLowerCase()) }}
            </span>
          </td>
        </tr>
        <tr v-else>
          <td :colspan="headers.length" class="text-center p-4">{{ $t('getInfo') }}...</td>
        </tr>
      </tbody>
    </table>
    <div class="hidden lg:flex justify-end items-center mt-4 w-full direction-rtl" v-if="total > 0">
      <div>
        {{ (page - 1) * limit + 1 }} تا {{ page * limit > total ? total : page * limit }} از
        {{ total }}
      </div>
      <div class="mr-4 flex">
        <ChevronRightIcon class="w-4 h-4 cursor-pointer mx-2" @click="prevPage" />
        <ChevronLeftIcon class="w-4 h-4 cursor-pointer mx-2" @click="nextPage" />
      </div>
    </div>
    <div class="lg:hidden w-full flex flex-col justify-center items-center space-y-8 direction-rtl">
      <CoreCardTransaction v-for="(item, index) in items" :key="index" :item="item" />
      <div class="mt-4" v-if="total > 0">
        <div class="flex justify-center items-center">
          <div>
            {{ (page - 1) * limit + 1 }} تا {{ page * limit > total ? total : page * limit }} از
            {{ total }}
          </div>
          <div class="mr-4 flex">
            <ChevronRightIcon class="w-4 h-4 cursor-pointer mx-2" @click="prevPage" />
            <ChevronLeftIcon class="w-4 h-4 cursor-pointer mx-2" @click="nextPage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
