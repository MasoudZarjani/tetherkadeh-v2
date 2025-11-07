<script lang="ts" setup>
const { locale } = useI18n()

defineProps<{
  modelValue: null | string;
  error: null | string;
  label: string;
  id: string;
  name: string;
  type: string;
  disabled: boolean;
}>();
</script>

<template>
  <div class="TextInput" :class="{ 'has-error': !!error }">
    <label
      :for="id"
      class="flex justify-start items-center text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-2"
    >
      {{ $t(label) }}
    </label>
    <input
      :name="name"
      :id="id"
      :type="type"
      :disabled="disabled"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="
        error
          ? 'outline-none ring-1 ring-red-500'
          : disabled
          ? 'cursor-not-allowed text-gray-500 dark:text-gray-400'
          : 'outline-none ring-1 ring-blue-400'
      "
      class="rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-gray-700 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    />
    <p class="help-message text-red-500 mt-1 text-sm" :class="locale === 'fa' ? 'text-right' : 'text-left'" v-if="error">
      {{ $t(error) }}
    </p>
  </div>
</template>
