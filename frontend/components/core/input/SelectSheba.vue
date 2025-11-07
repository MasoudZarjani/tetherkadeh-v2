<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid'

interface Select {
  name: string
  _id: string
  shebaNumber: string
}

const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const { locale } = useI18n()

defineProps<{
  items: Select[]
  modelValue: Select
}>()

const selected = (item: any) => {
  emit('update:modelValue', item)
}

const addNewCard = () => {
  router.push('/bank-accounts')
}
</script>

<template>
  <Listbox class="w-full mt-6" v-if="items">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-100 dark:border-slate-800 px-2 rounded-lg h-14 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        :class="locale === 'fa' ? 'text-right' : 'text-left'"
      >
        <span
          class="pointer-events-none absolute inset-y-0 flex items-center px-2"
          :class="locale === 'fa' ? 'left-0' : 'right-0'"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
        <span class="truncate flex justify-start items-center"
          >{{ $t('bank.title') }} {{ $t('bank.' + modelValue?.name?.toLowerCase()) }}
          -
          {{ modelValue?.shebaNumber }}
        </span>
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute w-full z-50 mt-1 max-h-60 overflow-auto rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-100 dark:border-slate-800 py-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="card in items"
            @click="selected(card)"
            :key="card._id"
            :value="card"
            as="template"
            class="mt-2"
          >
            <li
              class="relative cursor-pointer select-none py-2 pl-10 px-4"
              :class="{ 'bg-blue-400 text-white': active, '': !active }"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ $t('bank.' + card?.name?.toLowerCase()) + ' - ' + card?.shebaNumber }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-teal-600': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
          <hr class="text-slate-300 dark:text-slate-600" />
          <ListboxOption v-slot="{ selected }" @click="addNewCard()" as="template" class="mt-2">
            <li class="relative cursor-pointer select-none py-4 pl-10 px-4">
              <span
                class="block truncate text-center"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                + {{ $t('addCard') }}
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
