<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  reason: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const show = ref(props.modelValue)
watch(
  () => props.modelValue,
  val => (show.value = val)
)

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <transition name="fade-zoom">
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        class="bg-background-light-1 dark:bg-background-dark-1 rounded-2xl shadow-lg p-6 w-96 text-center transform transition"
      >
        <h2 class="text-xl font-bold mb-4">{{ $t('rejection') }}</h2>

        <div class="w-full mb-4 text-yellow-500">{{ reason }}</div>

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
