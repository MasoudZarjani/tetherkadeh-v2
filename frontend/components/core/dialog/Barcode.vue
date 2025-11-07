<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const emit = defineEmits(['update:modelValue'])

defineProps({
  modelValue: Boolean,
  item: String,
})

function closeModal() {
  emit('update:modelValue', false)
}
</script>
<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50 direction-rtl dark:text-white">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-700 p-6 text-right align-middle transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 flex justify-between border-b border-gray-2 pb-2"
              >
                {{ $t('code') }} QR
                <span>
                  <BaseIcon name="close" className="w-6 h-6 cursor-pointer" @click="closeModal" />
                </span>
              </DialogTitle>
              <div class="mt-8 flex justify-center">
                <div class="p-2 rounded-xl border border-blue-400 bg-white w-56">
                  <qrcode-vue :value="item" :size="200" level="M" />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
