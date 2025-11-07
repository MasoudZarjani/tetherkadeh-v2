<script setup lang="ts">
interface Tab {
  name: string;
  key: string;
  current: boolean;
  status: boolean;
}
const emit = defineEmits(["update:modelValue"]);

const tabs = ref([
  {
    name: "خرید تتر",
    key: "buy",
    current: true,
    status: true,
  },
  {
    name: "فروش تتر",
    key: "sell",
    current: false,
    status: true,
  },
]);

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
  <nav class="flex w-full justify-center items-center" aria-label="Tabs">
    <span
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectTab(tab)"
      class="lg:px-3 px-1 py-2 md:py-4 cursor-pointer w-full text-center"
      :class="
        tab.current
          ? tab.key === 'buy'
            ? 'text-green-500'
            : 'text-red-500'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
      "
      :aria-current="tab.current ? 'page' : undefined"
    >
      {{ tab.name }}
    </span>
  </nav>
</template>
