<script setup lang="ts">
const { locale } = useI18n()

defineProps<{
  modelValue: string
  isLoading: boolean
  disabled: boolean
  error: null | string
}>()
</script>

<template>
  <div class="w-full relative">
    <input
      name="email"
      :placeholder="$t('email')"
      id="email"
      type="text"
      :disabled="isLoading || disabled"
      :class="
        isLoading || disabled
          ? 'placeholder-gray-300 dark:placeholder-gray-500 text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-700'
          : 'placeholder-gray-500 dark:placeholder-gray-300 bg-gray-200 dark:bg-gray-900'
      "
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="rounded-md lg:rounded-lg border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    />
    <div
      class="absolute left-2 top-3 cursor-pointer text-blue-400-1"
      v-if="!isLoading && !disabled"
      @click="$emit('sendVerifyCode', 'email')"
    >
      {{ $t('sendCode') }}
    </div>
    <div v-if="isLoading" class="absolute left-4 top-3">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <p class="help-message text-red-500 mt-1 font-12"  :class="locale === 'fa' ? 'text-right' : 'text-left'" v-if="error">
      {{ $t(error) }}
    </p>
  </div>
</template>
