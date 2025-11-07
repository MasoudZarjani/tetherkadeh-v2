<script setup lang="ts">
defineProps<{ faqs: Array<{ title: string; text: string; active: boolean }> }>()

defineEmits(['toggle'])
</script>

<template>
  <div class="bg-slate-200 dark:bg-slate-700 flex flex-col gap-px" id="accordion">
    <div
      v-for="item in faqs"
      :key="item.title"
      class="item w-full"
      :class="item.active ? 'active' : ''"
    >
      <div
        class="header p-6 bg-slate-50 dark:bg-slate-800 font-bold flex justify-between items-center cursor-pointer"
        @click="$emit('toggle', item)"
      >
        <div>{{ $t(item.title) }}</div>
        <svg v-if="!item.active" class="size-6 fill-black dark:fill-white">
          <path d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
        <svg v-else class="size-6 fill-black dark:fill-white">
          <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      <div class="content transition-all duration-300">
        <p class="mb-5">{{ $t(item.text) }}</p>
      </div>
    </div>
  </div>
</template>
