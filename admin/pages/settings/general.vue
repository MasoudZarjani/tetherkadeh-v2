<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const { token } = useAuth();
const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "تنظیمات عمومی",
  pageTransition: {
    name: "rotate",
  },
});

const items = ref<any>(null);
const valid = ref(true);
const lazy = ref(true);
const isLoading = ref(false);
const rules = ref({
  required: (value: string) => !!value || "الزامی می باشد.",
});

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  items.value = await api.get("/api/v1/setting");
  toggleOverlay(false);
};

const save = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  try {
    delete items.value.default;
    await api.post("/api/v1/setting/bulk", { settings: items.value });
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
  }
};

const onFileChanged = async (event: Event, type: string) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) return;

  toggleOverlay(true);
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response: any = await $fetch(
      `${config.public.baseURL}/api/v1/admin/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token.value || "",
        },
      }
    );

    const filename = response.data.filename;

    switch (type) {
      case "logo":
        items.value.logo = filename;
        break;
      case "logoDark":
        items.value.logoDark = filename;
        break;
      case "logoText":
        items.value.logoText = filename;
        break;
      case "logoTextDark":
        items.value.logoTextDark = filename;
        break;
      case "logoMobile":
        items.value.logoMobile = filename;
        break;
      case "logoMobileDark":
        items.value.logoMobileDark = filename;
        break;
      case "favicon":
        items.value.favicon = filename;
        break;
      case "faviconDark":
        items.value.faviconDark = filename;
        break;
    }
  } catch (error: any) {
    const message = error?.data?.messages?.[0] || "خطای ارتباط با سرور";
    showAlert({ text: message, color: "error" });
  } finally {
    toggleOverlay(false);
  }
};
</script>

<template>
  <v-card title="تنظیمات عمومی" v-if="items">
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
      class="my-4"
      @submit.prevent="save"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.frontUrl"
              :rules="[rules.required]"
              label="آدرس دامنه فرانت"
              prepend-inner-icon="mdi-web"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.backendUrl"
              :rules="[rules.required]"
              label="آدرس دامنه بک اند"
              prepend-inner-icon="mdi-web"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.siteName"
              :rules="[rules.required]"
              label="نام سایت"
              prepend-inner-icon="mdi-rename"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.mobile"
              label="شماره همراه"
              prepend-inner-icon="mdi-rename"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.phone"
              label="تلفن"
              prepend-inner-icon="mdi-numeric"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.address"
              label="آدرس"
              prepend-inner-icon="mdi-identifier"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.email"
              :rules="[rules.required]"
              label="پست الکترونیکی"
              prepend-inner-icon="mdi-identifier"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.map"
              label="نقشه گوگل"
              prepend-inner-icon="mdi-identifier"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="mb-4"></v-divider>
        <v-row>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.favicon"
                  v-if="items.favicon"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب آیکن
                <input
                  type="file"
                  @change="onFileChanged($event, 'favicon')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.faviconDark"
                  v-if="items.faviconDark"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب آیکن دارک
                <input
                  type="file"
                  @change="onFileChanged($event, 'faviconDark')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logo"
                  v-if="items.logo"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو
                <input
                  type="file"
                  @change="onFileChanged($event, 'logo')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logoDark"
                  v-if="items.logoDark"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو تاریک
                <input
                  type="file"
                  @change="onFileChanged($event, 'logoDark')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logoText"
                  v-if="items.logoText"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو متنی
                <input
                  type="file"
                  @change="onFileChanged($event, 'logoText')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logoTextDark"
                  v-if="items.logoTextDark"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو متنی تاریک
                <input
                  type="file"
                  @change="onFileChanged($event, 'logoTextDark')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logoMobile"
                  v-if="items.logoMobile"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو موبایل
                <input
                  type="file"
                  @change="onFileChanged($event, 'logoMobile')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="4">
            <v-sheet class="pa-4 text-center" border="md opacity-12">
              <v-sheet class="mx-auto" height="100" width="100">
                <img
                  :src="config.public.baseURL + items.logoMobileDark"
                  v-if="items.logoMobileDark"
                  width="100"
                />
              </v-sheet>
              <label
                class="mt-4 v-btn v-btn--elevated text-white bg-primary pa-2"
                style="cursor: pointer"
              >
                انتخاب لوگو موبایل دارک
                <input
                  type="file"
                  @change="onFileChanged($event, 'logoMobileDark')"
                  class="d-none"
                  ref="fileInputRef"
              /></label>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="submit"
          color="primary"
          size="large"
          class="bg-primary text-white ms-auto"
          flat
          >ویرایش</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>
