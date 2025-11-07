<script lang="ts" setup>
import VueCountdown from '@chenfengyuan/vue-countdown'

interface Props {
  isLoading?: boolean
  timerDuration?: number // به میلی‌ثانیه (پیش‌فرض: 2 دقیقه)
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  timerDuration: 2 * 60 * 1000,
})

const emit = defineEmits<{
  completed: [code: string]
  sendAgain: []
}>()

const code = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const timerStatus = ref(false)
const countdownKey = ref(0)

watch(
  code,
  val => {
    const joined = val.join('')
    if (joined.length === 6 && !val.includes('')) {
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
  const value = target.value.replace(/\D/g, '')

  if (value.length > 1) {
    pasteHandler(value, index)
    return
  }

  code.value[index] = value

  if (value && index < 5) {
    nextTick(() => inputs.value[index + 1]?.focus())
  }
}

const handleKeydown = (e: KeyboardEvent, index: number) => {
  // Backspace
  if (e.key === 'Backspace') {
    e.preventDefault()

    if (code.value[index]) {
      code.value[index] = ''
    } else if (index > 0) {
      code.value[index - 1] = ''
      nextTick(() => inputs.value[index - 1]?.focus())
    }
    return
  }

  // Arrow keys navigation
  if (e.key === 'ArrowLeft' && index > 0) {
    e.preventDefault()
    inputs.value[index - 1]?.focus()
  }

  if (e.key === 'ArrowRight' && index < 5) {
    e.preventDefault()
    inputs.value[index + 1]?.focus()
  }

  // Delete
  if (e.key === 'Delete') {
    e.preventDefault()
    code.value[index] = ''
  }
}

const pasteHandler = (text: string, startIndex = 0) => {
  const numbers = text.replace(/\D/g, '').split('').slice(0, 6)

  numbers.forEach((n, i) => {
    const targetIndex = startIndex + i
    if (targetIndex < 6) {
      code.value[targetIndex] = n
    }
  })

  const nextFocusIndex = Math.min(5, startIndex + numbers.length - 1)
  nextTick(() => inputs.value[nextFocusIndex]?.focus())
}

const onPaste = (e: ClipboardEvent, index: number) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') || ''
  if (text) {
    pasteHandler(text, index)
  }
}

const pasteFromButton = async () => {
  try {
    if (!navigator.clipboard) {
      console.error('Clipboard API is not supported')
      return
    }

    const text = await navigator.clipboard.readText()
    if (text) {
      pasteHandler(text, 0)
    }
  } catch (error) {
    console.error('خطا در خواندن کلیپ‌بورد:', error)
  }
}

const onCountdownEnd = () => {
  timerStatus.value = true
}

const sendAgain = () => {
  emit('sendAgain')
  timerStatus.value = false
  countdownKey.value++ // Reset countdown
  reset()
}

// Focus on first input when mounted
onMounted(() => {
  nextTick(() => inputs.value[0]?.focus())
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center font-medium mb-2">
      <label class="text-gray-500">
        {{ $t('smsLabel') }}
      </label>
      <button
        type="button"
        class="text-blue-400 hover:text-blue-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
        @click="pasteFromButton"
        :disabled="isLoading"
      >
        {{ $t('paste') || 'چسباندن' }}
      </button>
    </div>

    <div class="text-right">
      <div class="flex justify-between gap-2 mb-6" dir="ltr">
        <input
          v-for="(_, index) in code"
          :key="index"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          autocomplete="one-time-code"
          :disabled="isLoading"
          class="bg-slate-300 dark:bg-slate-900 w-12 h-12 text-center border border-gray-200 dark:border-gray-700 rounded-lg text-xl font-bold focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'ring-2 ring-blue-400 dark:ring-blue-500': code[index],
          }"
          v-model="code[index]"
          :ref="
            (el: any) => {
              if (el) inputs[index] = el as HTMLInputElement
            }
          "
          @input="handleInput($event, index)"
          @keydown="handleKeydown($event, index)"
          @paste="onPaste($event, index)"
        />
      </div>

      <div class="text-sm">
        <vue-countdown
          v-if="!timerStatus"
          :key="countdownKey"
          :time="props.timerDuration"
          @end="onCountdownEnd"
          v-slot="{ minutes, seconds }"
        >
          <span class="text-gray-600 dark:text-gray-400">
            {{ $t('remainingTime') }}:
            <span class="font-mono"
              >{{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}</span
            >
          </span>
        </vue-countdown>

        <button
          v-else
          type="button"
          class="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
          :disabled="isLoading"
          @click="sendAgain"
        >
          {{ $t('sendAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>
