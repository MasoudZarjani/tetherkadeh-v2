import { ref } from 'vue'
import type { CropperResult } from 'vue-advanced-cropper'
import { useAlertStore } from '~/stores/alert'
import { useAuth } from '@/composables/useAuth'

export function useImageUploadAdvanced() {
  const config = useRuntimeConfig()
  const { token } = useAuth()
  const { showAlert } = useAlertStore()
  console.log(token.value)
  const fileInput = ref<HTMLInputElement | null>(null)
  const previewUrl = ref<string | null>(null)
  const croppedUrl = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const cropperRef = ref<any>(null)
  const imagePath = ref('')

  // اعتبارسنجی فایل و نمایش
  function validateAndPreview(file: File) {
    errorMessage.value = null

    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'فقط فایل تصویری مجاز است.'
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'حداکثر حجم فایل ۵ مگابایت است.'
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      previewUrl.value = e.target?.result as string
      croppedUrl.value = null
    }
    reader.readAsDataURL(file)
  }

  // انتخاب فایل
  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) validateAndPreview(file)
  }

  // کراپ تصویر
  function cropImage() {
    if (cropperRef.value) {
      const { canvas }: CropperResult = cropperRef.value.getResult()
      if (canvas) {
        croppedUrl.value = canvas.toDataURL('image/jpeg')
      }
    }
  }

  // ارسال تصویر کراپ‌شده
  async function uploadCroppedImage() {
    try {
      if (!croppedUrl.value) return
      const blob = await (await fetch(croppedUrl.value)).blob()
      const formData = new FormData()
      formData.append('file', blob, 'cropped.jpg')

      const data: any = await $fetch(`${config.public.baseURL}/api/v1/user/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token.value}` || '',
        },
      })
      imagePath.value = data.data.filename
      return true
    } catch (error: any) {
      if (error.data.message) showAlert({ text: error.data.message[0], color: 'error' })
      else showAlert({ text: 'خطای ارتباط با سرور', color: 'error' })
    }
  }

  return {
    fileInput,
    previewUrl,
    croppedUrl,
    errorMessage,
    cropperRef,
    handleFileChange,
    cropImage,
    uploadCroppedImage,
    imagePath,
  }
}
