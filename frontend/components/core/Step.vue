<script lang="ts" setup>
defineProps({
  step: {
    type: Number,
    default: 1,
  },
})
</script>
<template>
  <ol class="flex items-center w-full">
    <li
      class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-8 rounded-s-full after:inline-block after:border-blue-400"
    ></li>
    <li
      class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-8 after:inline-block"
      :class="step >= 2 ? 'after:border-blue-400' : 'after:dark:border-slate-800'"
    >
      <span
        class="flex items-center justify-center rounded-full lg:h-12 lg:w-12 shrink-0"
        :class="step >= 2 ? 'w-10 h-10 bg-blue-400' : 'w-10 h-10 bg-slate-50 dark:bg-slate-800'"
      >
        <svg
          class="w-3.5 h-3.5 lg:w-4 lg:h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 12"
          v-if="step >= 2"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5.917 5.724 10.5 15 1.5"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          v-else
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </span>
    </li>
    <li
      class="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-8 after:inline-block"
      :class="step >= 3 ? 'after:border-blue-400' : 'after:dark:border-slate-800'"
    >
      <span
        class="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0"
        :class="step >= 3 ? 'w-10 h-10 bg-blue-400' : 'w-10 h-10 bg-slate-50 dark:bg-slate-800'"
      >
        <svg
          class="w-3.5 h-3.5 lg:w-4 lg:h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 12"
          v-if="step >= 3"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5.917 5.724 10.5 15 1.5"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
          v-else
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </span>
    </li>
  </ol>
</template>
