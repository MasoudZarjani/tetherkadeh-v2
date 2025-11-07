<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid'

interface Select {
  name: string
  _id: string
  isDeposit: boolean
  isWithdraw: boolean
  slug: string
  withdrawFee: number
  depositFee: number
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  items: Select[]
  modelValue: Select
  side: String
}>()

const selected = (item: any) => {
  emit('update:modelValue', item)
}

const checkEnabled = (network: any) => {
  if (props.side === 'deposit') return network?.isDeposit
  else return network?.isWithdraw
}
</script>
<template>
  <Listbox class="w-full mt-6">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900 text-right rounded-lg h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
      >
        <span
          class="w-full h-12 border-none py-2 pl-3 pr-3 text-sm leading-5 focus:ring-0"
          v-if="modelValue"
        >
          {{ modelValue?.name }} ({{ modelValue.slug.toUpperCase() }})
        </span>
        <span class="w-full h-12 border-none py-2 pl-3 pr-3 text-sm leading-5 focus:ring-0" v-else
          >{{ $t('network') }} {{ side === 'withdraw' ? $t('withdraw') : $t('deposit') }}</span
        >
        <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <ChevronUpDownIcon class="h-5 w-5 text-blue-400" aria-hidden="true" />
        </span>
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute shadow-md z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-200 dark:bg-slate-700 py-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            @click="selected(network)"
            v-for="network in items"
            :key="network.name"
            :value="network"
            as="template"
          >
            <li
              class="cursor-pointer direction-ltr"
              :class="[
                active ? 'bg-slate-200 dark:bg-slate-800' : 'text-white-900',
                'relative cursor-default select-none py-2 pl-4',
              ]"
            >
              <div
                :class="!checkEnabled(network) ? 'text-gray-500 dark:text-gray-400' : ''"
                class="w-full flex justify-between items-center"
              >
                <div
                  class="text-gray-700 dark:text-gray-300 text-left"
                  :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                >
                  <div>{{ network?.name }} ({{ network.slug.toUpperCase() }})</div>
                  <div v-if="side === 'withdraw'">
                    fee:
                    {{ side === 'withdraw' ? modelValue.withdrawFee : modelValue.depositFee }}
                    USDT
                  </div>
                </div>
                <div v-if="!checkEnabled(network)">غیرفعال</div>
              </div>
              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center p3-3 text-blue-400"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
