<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
const config = useRuntimeConfig()

defineProps<{
  modelValue: string
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const {
  fileInput,
  previewUrl,
  croppedUrl,
  errorMessage,
  cropperRef,
  handleFileChange,
  cropImage,
  uploadCroppedImage,
  imagePath,
} = useImageUploadAdvanced()

const showModal = ref(false)

// باز کردن Modal بعد از بارگذاری فایل
function openCropperDelayed() {
  setTimeout(() => {
    if (previewUrl.value) showModal.value = true
  }, 100)
}

// تایید کراپ و ایجاد پیش‌نمایش
function confirmCrop() {
  cropImage()
}

// انصراف کامل و ریست کردن
function cancelCrop() {
  showModal.value = false
  previewUrl.value = null
  croppedUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// ارسال تصویر: بعد از موفقیت Modal بسته و پیام نمایش داده شود
async function confirmAndUpload() {
  try {
    await uploadCroppedImage() // فرض بر این است که این تابع Promise برمی‌گرداند
    showModal.value = false

    // پاک کردن انتخاب‌ها بعد از موفقیت
    previewUrl.value = null
    croppedUrl.value = null
    if (fileInput.value) fileInput.value.value = ''

    emit('update:modelValue', imagePath.value)
  } catch (err) {}
}
</script>

<template>
  <div class="w-full mx-auto">
    <!-- Upload Area -->
    <div
      class="upload-area bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl p-8 text-center cursor-pointer"
      @click="!disabled ? fileInput?.click() : ''"
    >
      <div class="mb-4">
        <svg
          v-if="!imagePath"
          class="mx-auto h-16 w-16 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <img v-else :src="`${config.public.baseURL}${imagePath}`" class="max-h-64 max-w-full" />
      </div>
      <h3 v-if="!imagePath" class="text-lg font-semibold mb-2">
        {{ $t('uploadImageTitle') }}
      </h3>
      <p class="text-gray-500 text-sm" v-if="!imagePath">{{ $t('allowedFormats') }}: JPG, PNG</p>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="
          (e: any) => {
            handleFileChange(e)
            openCropperDelayed()
          }
        "
      />
    </div>
    <p v-if="errorMessage" class="text-red-500 mt-3 text-center">
      {{ errorMessage }}
    </p>

    <!-- Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div
          class="bg-slate-200 dark:bg-slate-700 rounded-xl shadow-lg w-full max-w-3xl p-6 transform transition-transform duration-300 scale-95"
          :class="{ 'scale-100': showModal }"
        >
          <h3 class="text-lg font-semibold mb-4 text-center">{{ $t('cropAndPrev') }}</h3>

          <!-- Cropper -->
          <div v-if="!croppedUrl">
            <Cropper ref="cropperRef" class="h-96 w-full rounded-lg border" :src="previewUrl" />
          </div>

          <!-- Preview نهایی -->
          <div v-else class="text-center">
            <img :src="croppedUrl" class="image-preview rounded-lg mx-auto max-h-80 border" />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-4 mt-6">
            <button
              v-if="!croppedUrl"
              @click="confirmCrop"
              class="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {{ $t('acceptCrop') }}
            </button>

            <button
              v-if="croppedUrl"
              @click="confirmAndUpload"
              class="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {{ $t('uploadImage') }}
            </button>

            <button
              @click="cancelCrop"
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {{ $t('close') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.upload-area {
  border: 2px dashed #e5e7eb;
  transition: all 0.3s ease;
}
.upload-area:hover {
  border-color: #34d399;
}
.image-preview {
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* انیمیشن Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
