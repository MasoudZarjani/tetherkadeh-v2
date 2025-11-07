<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAlertStore } from '~/stores/alert'

const alertStore = useAlertStore()
const { active } = storeToRefs(alertStore)
const { closeAlert } = alertStore
</script>

<template>
  <transition name="fade">
    <div
      v-if="active"
      class="fixed right-4 top-3 z-60 mt-2 mr-2 text-sm text-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-3 transition-all duration-300"
      :class="{
        'bg-red-500 border border-red-500': active.color === 'error',
        'bg-green-500 border border-green-500': active.color === 'success',
        'bg-yellow-500 border border-yellow-500': active.color === 'warning',
        'bg-blue-500 border border-blue-500': active.color === 'info',
      }"
      role="alert"
    >
      <span>{{ active.text }}</span>
      <button @click="closeAlert" class="ml-2 opacity-70 hover:opacity-100 transition">✖</button>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
