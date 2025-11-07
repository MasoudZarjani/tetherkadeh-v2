<script setup lang="ts">
import { QrCodeIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

defineProps({
  address: String,
  label: String,
});

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};
</script>
<template>
  <CoreDialogBarcode v-model="isOpen" :item="address" />
  <div class="w-full mt-4">
    <label
      for="destinationTag"
      class="w-full text-xs lg:text-base font-medium dark:text-gray-1 text-right mb-1"
    >
      {{ label }}
    </label>
    <div
      class="w-full flex justify-between items-center rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-50 dark:border-slate-900"
    >
      <input
        name="address"
        id="address"
        type="text"
        :value="address"
        disabled
        class="block h-12 w-full px-3 py-2 sm:text-sm bg-slate-200 dark:bg-slate-700 rounded-lg"
      />
      <div class="flex justify-center items-center gap-2">
        <DocumentDuplicateIcon
          class="w-6 cursor-pointer text-blue-400-1"
          @click="useCopy(address)"
        />
        <QrCodeIcon
          class="w-6 cursor-pointer text-blue-400-1"
          @click="openModal()"
        />
      </div>
    </div>
    <slot />
  </div>
</template>
