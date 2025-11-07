<script setup lang="ts">
defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue', 'confirm'])

const cardNumber = ref('')

function closeModal() {
  emit('update:modelValue', false)
}

watch(
  () => cardNumber,
  newVal => {
    let realNumber = newVal.value.replace(/-/gi, '')
    // Generate dashed number
    let dashedNumber = realNumber.match(/.{1,4}/g)

    // Replace the dashed number with the real one
    cardNumber.value = dashedNumber?.join('-') || ''
  },
  { deep: true }
)
const confirm = () => {
  emit('confirm', cardNumber.value)
  cardNumber.value = ''
}
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-slate-100 dark:bg-slate-800 rounded w-full max-w-md shadow-lg">
        <div class="text-xl w-full border-b border-gray-200 dark:border-gray-700">
          <div class="p-2 md:p-4 w-full flex justify-between items-center">
            {{ $t('addCard') }}
            <CoreIcon name="close" @click="closeModal()" class="w-5" />
          </div>
        </div>
        <div class="w-full p-2 md:p-4">
          <label for="cardNumber" class="block font-medium text-gray-500 text-right mb-2">
            {{ $t('cardNumber') }}
          </label>
          <input
            name="cardNumber"
            id="cardNumber"
            type="text"
            v-model="cardNumber"
            maxlength="19"
            pattern="[0-9]*"
            inputmode="numeric"
            class="block w-full bg-background-light-3 dark:bg-background-dark-3 h-14 direction-ltr text-center appearance-none rounded-xl px-3 py-2 placeholder-gray-400 focus:border-primary-1 focus:outline-none focus:ring-primary-1 sm:text-sm"
          />
          <CoreBtnDefault @click="confirm" class="mt-4 w-full">
            {{ $t('addCard') }}
          </CoreBtnDefault>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
