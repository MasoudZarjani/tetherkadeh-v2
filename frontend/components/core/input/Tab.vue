<script setup lang="ts">
interface Tab {
  name: string;
  key: string;
  current: boolean;
  status: boolean;
}
const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  tabs: Tab[];
}>();
const tabs = ref(props.tabs);

const selectTab = (item: Tab) => {
  tabs.value = tabs.value.map((tab) => {
    return {
      ...tab,
      current: tab.key === item.key,
    };
  });
  emit("update:modelValue", item);
};
</script>

<template>
  <nav class="flex w-full" aria-label="Tabs">
    <span
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectTab(tab)"
      class="lg:px-3 px-1 py-2 lg:font-medium text-xs lg:text-sm cursor-pointer mb-2"
      :class="
        tab.current ? 'text-blue-400' : 'text-gray-500 hover:text-blue-500'
      "
      :aria-current="tab.current ? 'page' : undefined"
    >
      {{ tab.name }}
    </span>
  </nav>
</template>
