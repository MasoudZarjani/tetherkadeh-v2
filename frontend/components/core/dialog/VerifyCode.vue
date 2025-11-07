<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'completed', code: string): void
}>()

const show = ref(props.modelValue)
watch(
  () => props.modelValue,
  val => (show.value = val)
)

const code = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])

watch(
  code,
  val => {
    const joined = val.join('')
    if (joined.length === 6 && !val.includes('')) {
      // Auto-submit
      emit('completed', joined)
      emit('update:modelValue', false)
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

const closeModal = () => {
  emit('update:modelValue', false)
  reset()
}

const pasteFromButton = async () => {
  const text = await navigator.clipboard.readText()
  pasteHandler(text, 0)
}
</script>

<template>
  <transition name="fade-zoom">
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        class="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg p-6 w-96 text-center transform transition"
      >
        <h2 class="text-xl font-bold mb-4">{{ $t('verifyCode') }}</h2>
        <div class="flex justify-between items-center mb-2">
          <p class="text-gray-500">{{ $t('enterVerifyCode') }}</p>
          <div class="text-primary-1 cursor-pointer" @click="pasteFromButton">
            {{ $t('paste') }}
          </div>
        </div>

        <div class="flex justify-between mb-6" dir="ltr">
          <input
            v-for="(_, index) in code"
            :key="index"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            class="bg-slate-200 dark:bg-slate-700 w-12 h-12 text-center border border-gray-200 dark:border-gray-700 rounded-lg text-xl font-bold focus:ring-2 focus:ring-slate-300 dark:ring-slate-600 outline-none"
            v-model="code[index]"
            ref="inputs"
            @input="handleInput($event, index)"
            @keydown="handleBackspace($event, index)"
            @paste="onPaste($event, index)"
          />
        </div>

        <button
          @click="closeModal"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold transition"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
