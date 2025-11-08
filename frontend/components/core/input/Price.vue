<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

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
  placeholder: {
    type: String,
    default: 'price',
  },
})

const modelValue = toRef(props, 'modelValue')

const increase = () => {
  const value = parseFloat(modelValue.value.replace(/,/gi, ''))
  emit('update:modelValue', (value + 1).toLocaleString())
}

const decrease = () => {
  const value = parseFloat(modelValue.value.replace(/,/gi, ''))
  emit('update:modelValue', (value - 1).toLocaleString())
}
</script>
<template>
  <div
    class="relative direction-ltr flex items-center box-border rounded-lg bg-slate-200 dark:bg-slate-700 pl-3 pr-11"
    :class="
      error ? 'ring-1 ring-red-500' : 'outline-none ring-1 ring-slate-300 dark:ring-slate-600'
    "
  >
    <input
      autocomplete="off"
      :placeholder="$t(placeholder)"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      inputmode="numeric"
      class="w-full flex-1 h-10 font-medium bg-transparent outline-none"
    />
    <div class="text-sm mr-1 text-gray-400">{{ base }}</div>
    <div class="absolute top-1/2 transform -translate-y-1/2 right-1">
      <div class="flex flex-col rounded-sm overflow-hidden relative z-10">
        <div
          @click="increase()"
          class="inline-flex items-center justify-center border border-gray-500 rounded-t-md cursor-pointer w-6 h-4"
        >
          <svg
            class="ICTriangleTop_svg__icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="#8C8C8C"
          >
            <path
              d="M298.656 682.656A42.656 42.656 0 01256 640v-49.984c0-22.624 8.992-44.32 24.992-60.352l170.656-170.656a85.344 85.344 0 01120.672 0l170.656 170.656c16 16 24.992 37.696 24.992 60.352V640c0 23.552-19.104 42.656-42.656 42.656H298.656z"
            ></path>
          </svg>
        </div>
        <div
          @click="decrease()"
          class="inline-flex items-center justify-center border border-gray-500 rounded-b-md cursor-pointer w-6 h-4"
        >
          <svg
            class="ICTriangleBottom_svg__icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="#8C8C8C"
          >
            <path
              d="M298.656 341.344C275.104 341.344 256 360.448 256 384v49.984c0 22.624 8.992 44.32 24.992 60.352l170.656 170.656a85.344 85.344 0 00120.672 0l170.656-170.656c16-16 24.992-37.696 24.992-60.352V384c0-23.552-19.104-42.656-42.656-42.656H298.656z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
