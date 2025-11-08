<script lang="ts" setup>
defineProps({
  outline: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    class="relative px-3 flex items-center justify-center gap-x-2 text-nowrap text-button-medium duration-150 focus:outline-none focus-visible:outline-none overflow-hidden cursor-pointer transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-white before:transition-all before:duration-500 hover:before:left-0 hover:before:w-full disabled:bg-gray-300 disabled:text-gray-500 disabled:dark:bg-gray-700 disabled:dark:text-gray-500"
    :class="[
      outline
        ? 'border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white before:opacity-10'
        : 'bg-blue-400 text-white hover:bg-blue-500 before:opacity-20',
      rounded ? 'rounded-full h-12 w-12 md:w-14 md:h-14' : 'rounded-md h-14 min-w-16',
      isLoading ? 'transition ease-in-out duration-150 cursor-not-allowed opacity-75' : '',
    ]"
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
