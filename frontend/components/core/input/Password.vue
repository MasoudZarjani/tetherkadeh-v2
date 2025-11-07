<script lang="ts" setup>
const { locale } = useI18n()
defineProps<{
  modelValue: string
  error: null | string
  label: string
}>()
const showPassword = ref(false)
</script>

<template>
  <div class="TextInput" :class="{ 'has-error': !!error }">
    <label
      for="password"
      class="flex justify-start items-center text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-2"
    >
      {{ $t(label) }}
      <div class="group relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          class="mx-2"
          height="18"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M11 0C12.0098 0 12.9837 0.128906 13.9219 0.386719C14.86 0.644531 15.7337 1.01693 16.543 1.50391C17.3522 1.99089 18.0934 2.5638 18.7666 3.22266C19.4398 3.88151 20.0163 4.62272 20.4961 5.44629C20.9759 6.26986 21.3447 7.14714 21.6025 8.07812C21.8604 9.00911 21.9928 9.98307 22 11C22 12.0098 21.8711 12.9837 21.6133 13.9219C21.3555 14.86 20.9831 15.7337 20.4961 16.543C20.0091 17.3522 19.4362 18.0934 18.7773 18.7666C18.1185 19.4398 17.3773 20.0163 16.5537 20.4961C15.7301 20.9759 14.8529 21.3447 13.9219 21.6025C12.9909 21.8604 12.0169 21.9928 11 22C9.99023 22 9.01628 21.8711 8.07812 21.6133C7.13997 21.3555 6.26628 20.9831 5.45703 20.4961C4.64779 20.0091 3.90658 19.4362 3.2334 18.7773C2.56022 18.1185 1.98372 17.3773 1.50391 16.5537C1.02409 15.7301 0.655273 14.8529 0.397461 13.9219C0.139648 12.9909 0.00716146 12.0169 0 11C0 9.99023 0.128906 9.01628 0.386719 8.07812C0.644531 7.13997 1.01693 6.26628 1.50391 5.45703C1.99089 4.64779 2.5638 3.90658 3.22266 3.2334C3.88151 2.56022 4.62272 1.98372 5.44629 1.50391C6.26986 1.02409 7.14714 0.655273 8.07812 0.397461C9.00911 0.139648 9.98307 0.00716146 11 0ZM12.375 16.5V13.75H9.625V16.5H12.375ZM12.375 12.375V5.5H9.625V12.375H12.375Z"
            fill="#155dfc"
          />
        </svg>
        <div
          class="absolute bg-white text-black p-4 rounded-lg hidden group-hover:block bottom-6 w-60 lg:w-96 text-xs"
          :class="locale === 'fa' ? 'right-0 text-right' : 'left-0 text-left'"
        >
          {{ $t('passwordHint') }}
        </div>
      </div>
    </label>
    <div class="relative">
      <div
        class="absolute inset-y-0 top-5 lg:top-6 flex items-center pl-2 lg:pl-3 cursor-pointer right-8"
      >
        <BaseIcon
          name="eye"
          className="w-5 lg:w-6 top-1/2 absolute transform -translate-y-1/2 left-3 text-blue-400"
          v-if="!showPassword"
          @click="showPassword = !showPassword"
        />
        <BaseIcon
          name="eye-close"
          className="w-5 lg:w-6 top-1/2 absolute transform -translate-y-1/2 left-3 text-blue-400"
          v-else
          @click="showPassword = !showPassword"
        />
      </div>
    </div>
    <input
      name="password"
      :id="label"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="true"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="error ? 'outline-none ring-1 ring-red-500' : 'outline-none ring-1 ring-blue-400'"
      class="direction-ltr rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    />
    <p class="help-message text-red-500 mt-1 text-xs" :class="locale === 'fa' ? 'text-right' : 'text-left'" v-if="error">
      {{ $t(error) }}
    </p>
  </div>
</template>
