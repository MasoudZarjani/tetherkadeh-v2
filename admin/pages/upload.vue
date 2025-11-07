<script lang="ts" setup>
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

definePageMeta({
  auth: true,
  breadcrumbs: "بارگذاری فایل",
});

const { token } = useAuth();
const config = useRuntimeConfig();
const { toggleOverlay } = useOverlayStore();
const { showAlert } = useAlertStore();

const file = ref<HTMLInputElement | null>(null);
const filePath = ref("");
const selectFile = ref("");

const onFileChanged = async ($event: any) => {
  try {
    toggleOverlay(true);
    const target = $event.target;
    if (target && target.files) {
      selectFile.value = target.files[0];
    }
    let formData = new FormData();
    formData.append("file", selectFile.value);
    const data: any = await $fetch(
      `${config.public.baseURL}/api/v1/admin/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token.value || "",
        },
      }
    );
    filePath.value = data.data.filename;
  } catch (error: any) {
    if (error.data.messages)
      showAlert({ text: error.data.messages[0], color: "error" });
    else showAlert({ text: "خطای ارتباط با سرور", color: "error" });
  } finally {
    toggleOverlay(false);
  }
};

function triggerFileDialog() {
  file.value?.click();
}
</script>

<template>
  <div class="p-4 mt-8">
    <div class="flex flex-col items-center justify-center text-center">
      <input type="file" @change="onFileChanged" class="d-none" ref="file" />
      <v-btn @click="triggerFileDialog" class="btn btn-primary"
        >انتخاب فایل</v-btn
      >
    </div>
    <div
      class="flex flex-col items-center justify-center text-center mt-8 cursor-pointer"
      @click="useCopy(`${config.public.baseURL + filePath}`)"
    >
      {{ config.public.baseURL }}{{ filePath }}
    </div>
  </div>
</template>
