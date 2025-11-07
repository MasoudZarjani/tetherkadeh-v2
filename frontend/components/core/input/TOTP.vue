<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue'

const emit = defineEmits<{
  (e: 'completed', code: string): void
  (e: 'sendAgain'): void
}>()

const code = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])

watch(
  code,
  val => {
    const joined = val.join('')
    if (joined.length === 6 && !val.includes('')) {
      // Auto-submit
      emit('completed', joined)
      reset()
    }
  },
  { deep: true }
)

const reset = () => {
  code.value = Array(6).fill('')
  nextTick(() => inputs.value[0]?.focus())
}

const handleInput = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')

  if (value.length > 1) {
    pasteHandler(value, index)
    return
  }

  code.value[index] = value

  if (value && index < 5) {
    nextTick(() => inputs.value[index + 1]?.focus())
  }
}

const handleBackspace = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Backspace') {
    if (code.value[index]) {
      // پاک کردن همون فیلد
      code.value[index] = ''
    } else if (index > 0) {
      // رفتن به قبلی و پاک کردنش
      code.value[index - 1] = ''
      nextTick(() => inputs.value[index - 1]?.focus())
    }
  }
}

const pasteHandler = (text: string, startIndex = 0) => {
  const numbers = text.replace(/\D/g, '').split('')
  numbers.slice(0, 6).forEach((n, i) => {
    if (startIndex + i < 6) {
      code.value[startIndex + i] = n
    }
  })
  nextTick(() => inputs.value[Math.min(5, startIndex + numbers.length - 1)]?.focus())
}

const onPaste = (e: ClipboardEvent, index: number) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') || ''
  pasteHandler(text, index)
}

const pasteFromButton = async () => {
  const text = await navigator.clipboard.readText()
  pasteHandler(text, 0)
}
</script>

<template>
  <div>
    <div class="flex justify-between w-full items-center">
      <label class="text-gray-500">{{ $t('twoStepVerificationLabel') }}</label>
      <div class="text-blue-400-1 cursor-pointer" @click="pasteFromButton">{{ $t('paste') }}</div>
    </div>
    <div class="mt-1 text-right">
      <div class="flex justify-between mb-6" dir="ltr">
        <input
          v-for="(_, index) in code"
          :key="index"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          class="bg-gray-300 dark:bg-background-dark-3 w-12 h-12 text-center border border-gray-200 dark:border-gray-700 rounded-lg text-xl font-bold focus:ring-2 focus:ring-slate-300 dark:ring-slate-600 outline-none"
          v-model="code[index]"
          ref="inputs"
          @input="handleInput($event, index)"
          @keydown="handleBackspace($event, index)"
          @paste="onPaste($event, index)"
        />
      </div>
    </div>
  </div>
</template>
