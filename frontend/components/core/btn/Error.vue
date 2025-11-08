<script lang="ts" setup>
defineProps({
  outline: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="h-12 px-2 lg:px-6 rounded-lg text-white cursor-pointer"
    :class="outline ? 'border border-red-500' : 'bg-red-500'"
    :disabled="isLoading"
  >
    <div v-if="isLoading" class="flex justify-center items-center">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <slot v-else />
  </button>
</template>
