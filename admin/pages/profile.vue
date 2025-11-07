<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

const { data, token } = useAuth();
const config = useRuntimeConfig();
const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const user: any = data.value?.data;

definePageMeta({
  auth: true,
  breadcrumbs: "پروفایل",
  pageTransition: {
    name: "rotate",
  },
});

const fileInputRef = ref<HTMLInputElement | null>(null);

const userData = ref({
  firstName: user?.firstName,
  lastName: user?.lastName,
  email: user?.email,
  imagePath: user?.imagePath,
});

const updateProfile = async () => {
  toggleOverlay(true);
  try {
    await $fetch(`${config.public.baseURL}/api/v1/admin/${user?._id}`, {
      method: "PATCH",
      body: userData.value,
      headers: {
        Authorization: token.value || "",
      },
    });
    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
  } catch (error: any) {
    if (error.data.messages)
      showAlert({ text: error.data.messages[0], color: "error" });
    else showAlert({ text: "خطای ارتباط با سرور", color: "error" });
  } finally {
    toggleOverlay(false);
  }
};

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) return;

  try {
    toggleOverlay(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response: any = await $fetch(
      `${config.public.baseURL}/api/v1/admin/upload`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: token.value || "" },
      }
    );
    userData.value.imagePath = response.data.filename;
  } catch (error: any) {
    const message = error?.data?.messages?.[0] || "خطای ارتباط با سرور";
    showAlert({ text: message, color: "error" });
  } finally {
    toggleOverlay(false);
  }
};
</script>
<template>
  <v-card>
    <v-card-title class="pa-4 bg-primary">پروفایل کاربری</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="نام"
            v-model="userData.firstName"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="نام خانوادگی"
            v-model="userData.lastName"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="پست الکترونیکی"
            v-model="userData.email"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-sheet class="pa-8 text-center" border="md opacity-12">
            <v-sheet class="mx-auto" height="100" width="100">
              <img
                :src="config.public.baseURL + userData.imagePath"
                v-if="userData.imagePath"
                width="100"
              />
            </v-sheet>
            <input
              type="file"
              @change="onFileChanged"
              class="d-none"
              ref="fileInputRef"
            />
            <v-btn @click="fileInputRef?.click()" class="mt-4"
              >انتخاب تصویر</v-btn
            >
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="updateProfile">ویرایش</v-btn>
    </v-card-actions>
  </v-card>
</template>
