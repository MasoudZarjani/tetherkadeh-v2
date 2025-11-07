<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)
const isChecked = ref(false)

onMounted(() => {
  const hasSeen = localStorage.getItem('announcementSeen')
  if (!hasSeen) {
    visible.value = true
  }
})

function confirm() {
  localStorage.setItem('announcementSeen', 'true')
  visible.value = false
}
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <slot />
        <div class="flex items-center mb-4">
          <input type="checkbox" id="read" v-model="isChecked" class="accent-blue-400 w-4 h-4" />
          <label for="read" class="mr-2 text-sm text-gray-800 dark:text-gray-200">{{
            $t('iRead')
          }}</label>
        </div>

        <div class="flex justify-end">
          <button
            @click="confirm"
            :disabled="!isChecked"
            class="px-4 py-2 rounded-lg text-white bg-blue-400 hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
          >
            {{ $t('confirm') }}
          </button>
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
