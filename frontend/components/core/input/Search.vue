<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const { locale } = useI18n();

defineProps({
  modelValue: String,
  width: {
    type: String,
    default: "lg:w-96",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
  <span class="relative">
    <input
      type="text"
      :placeholder="$t('search')"
      class="rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 lg:rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900 w-full h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
      :class="width"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <MagnifyingGlassIcon
      class="w-4 h-4 lg:w-6 lg:h-6 absolute top-1 lg:top-0 text-blue-400"
      :class="locale === 'en' ? 'right-2' : 'left-2'"
    />
  </span>
</template>
