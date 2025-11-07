<script lang="ts" setup>
const { locale } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  base: String,
  baseIncrement: Number,
  error: {
    type: String,
    default: null,
  },
})

const modelValue = toRef(props, 'modelValue')
const baseIncrement = toRef(props, 'baseIncrement')

watch(
  () => modelValue.value,
  newVal => {
    if (newVal.indexOf('.') >= 0) {
      const intNumber = newVal.split('.')[0]
      const decNumber = newVal.split('.', baseIncrement.value)[1]
      const result = intNumber.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      nextTick(() => emit('update:modelValue', result + '.' + decNumber))
    } else {
      const result = newVal.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      nextTick(() => emit('update:modelValue', result))
    }
  },
  { deep: true }
)

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="relative w-full" :class="{ 'has-error': !!error }">
    <input
      name="amount"
      autocomplete="off"
      inputmode="numeric"
      id="amount"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="$t('amount1')"
      :class="
        error ? 'ring-1 ring-red-500' : 'outline-none ring-1 ring-slate-300 dark:ring-slate-600'
      "
      class="rounded-md lg:rounded-lg box-border bg-slate-200 dark:bg-slate-700 w-full h-8 lg:h-10 text-xs lg:text-base px-2 lg:px-4"
    />
    <span class="absolute top-2 lg:top-3" :class="locale === 'fa' ? 'left-2 lg:left-4' : 'right-2 lg:right-4'">{{ base }}</span>
    <p class="help-message text-red-500 mt-1 small-font text-xs" :class="locale === 'fa' ? 'text-right' : 'text-left'" v-if="error">
      {{ $t(error) }}
    </p>
  </div>
</template>
