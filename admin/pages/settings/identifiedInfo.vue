<script setup lang="ts">
import { useOverlayStore } from "~/store/overlay";

const { toggleOverlay } = useOverlayStore();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "حساب های بانکی صرافی",
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
  if (!items.value.identifiedInfo) {
    items.value.identifiedInfo = [];
  }
  toggleOverlay(false);
};

const addAccount = () => {
  items.value.identifiedInfo.push({
    shebaNumber: "",
    accountNumber: "",
    accountName: "",
  });
};

const removeAccount = (index: number) => {
  items.value.identifiedInfo.splice(index, 1);
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
</script>

<template>
  <v-card title="تنظیمات حساب های بانکی صرافی" v-if="items">
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
      class="my-4"
      @submit.prevent="save"
    >
      <v-card-text>
        <v-row
          v-for="(account, index) in items.identifiedInfo"
          :key="index"
          align="center"
        >
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="account.accountName"
              :rules="[rules.required]"
              label="نام صاحب حساب"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
              v-model="account.accountNumber"
              :rules="[rules.required]"
              label="شماره حساب"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field
              v-model="account.shebaNumber"
              :rules="[rules.required]"
              label="شماره شبا"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" sm="1" class="d-flex justify-end">
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              @click="removeAccount(index)"
            ></v-btn>
          </v-col>

          <v-divider
            v-if="index < items.identifiedInfo.length - 1"
            class="my-2"
          />
        </v-row>

        <v-btn
          color="success"
          variant="tonal"
          class="mt-4"
          prepend-icon="mdi-plus"
          @click="addAccount"
        >
          افزودن حساب جدید
        </v-btn>
      </v-card-text>

      <v-card-actions>
        <v-btn
          type="submit"
          color="primary"
          size="large"
          class="bg-primary text-white ms-auto"
          flat
          :loading="isLoading"
        >
          ذخیره تنظیمات
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
