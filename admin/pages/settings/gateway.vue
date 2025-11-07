<script setup lang="ts">
import { useOverlayStore } from "~/store/overlay";

const { toggleOverlay } = useOverlayStore();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "تنظیمات درگاه پرداخت",
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
</script>

<template>
  <v-card title="تنظیمات درگاه پرداخت" v-if="items">
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
      class="my-4"
      @submit.prevent="save"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="2">
            <v-switch
              v-model="items.activeGateway"
              color="primary"
              label="فعالسازی درگاه بانکی"
              hide-details
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="2">
            <v-switch
              v-model="items.jibitActive"
              color="primary"
              label="فعالسازی جیبیت"
              hide-details
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.jibitApiKey"
              :rules="[rules.required]"
              label="کلید API جیبیت"
              prepend-inner-icon="mdi-web"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="items.jibitSecretKey"
              :rules="[rules.required]"
              label="Secretkey جیبیت"
              prepend-inner-icon="mdi-web"
              variant="outlined"
            ></v-text-field>
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
