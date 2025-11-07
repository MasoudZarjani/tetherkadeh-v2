<script setup lang="ts">
import { ref, computed } from 'vue'

interface Select {
  name: string
  key: string
}

const props = defineProps<{
  items: Select[]
  modelValue: Select
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item: Select) => {
  emit('update:modelValue', item)
  isOpen.value = false
}

const selectedName = computed(() => props.modelValue?.name || 'انتخاب کنید...')
</script>

<template>
  <div class="relative w-full">
    <!-- Button -->
    <button
      type="button"
      class="w-full bg-background-light-3 dark:bg-background-dark-3 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-left shadow-md flex justify-between items-center focus:outline-none"
      @click="toggleDropdown"
    >
      <span>{{ selectedName }}</span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <ul
      v-show="isOpen"
      class="absolute z-20 mt-1 w-full bg-background-light-3 dark:bg-background-dark-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto py-1 text-base sm:text-sm"
    >
      <li
        v-for="item in props.items"
        :key="item.key"
        @click="selectItem(item)"
        class="cursor-pointer select-none relative py-2 px-3 hover:bg-primary-1 hover:text-white"
      >
        <span
          :class="[
            item.key === props.modelValue.key ? 'font-medium' : 'font-normal',
            'block truncate',
          ]"
        >
          {{ item.name }}
        </span>
      </li>
    </ul>
  </div>
</template>
