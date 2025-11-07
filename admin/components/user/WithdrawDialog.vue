<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

const model = defineModel<boolean>();
const api = useApi();
const { toggleOverlay } = useOverlayStore();
const { showAlert } = useAlertStore();
const config = useRuntimeConfig();

const props = defineProps<{
  userId: string;
}>();

const symbols: any = ref([]);
const coin = ref("");
const amount = ref(0);
const note = ref("");

onMounted(async () => {
  await getSymbols();
});

const getSymbols = async () => {
  toggleOverlay(true);
  try {
    const data: any = await api.get("/api/v1/symbol");
    symbols.value = data;
    console.log(symbols.value);
  } finally {
    toggleOverlay(false);
  }
};

const save = async (type: string) => {
  toggleOverlay(true);
  try {
    const payload = {
      amount: amount.value,
      coin: coin.value,
      type,
      transactionType: "Manual",
      userId: props.userId,
      reason: "شارژ حساب دستی",
      note: note.value,
    };
    await api.post("/api/v1/wallet", payload);
    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
  } finally {
    toggleOverlay(false);
  }
};
</script>

<template>
  <v-dialog max-width="500" v-model="model" v-if="symbols">
    <v-card title="برداشت از کیف پول">
      <v-card-text>
        <v-autocomplete
          v-model="coin"
          :items="symbols"
          label="انتخاب ارز"
          item-title="persianName"
          item-value="symbol"
          variant="outlined"
          hide-details
          chips
          closable-chips
        >
          <template v-slot:chip="{ props, item }: any">
            <v-chip
              v-bind="props"
              :prepend-avatar="config.public.baseURL + item.raw.imagePath"
              :text="item.raw.persianName"
            ></v-chip>
          </template>
          <template v-slot:item="{ props, item }: any">
            <v-list-item
              v-bind="props"
              :prepend-avatar="config.public.baseURL + item.raw.imagePath"
              :subtitle="item.raw.network"
              :title="item.raw.persianName"
            ></v-list-item>
          </template>
        </v-autocomplete>
        <v-text-field
          class="mt-4"
          v-model="amount"
          label="مقدار"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-textarea
          class="mt-4"
          v-model="note"
          label="توضیحات کاربر"
          variant="outlined"
          hide-details
        ></v-textarea>
      </v-card-text>
      <template v-slot:actions>
        <v-btn
          text="واریز"
          class="bg-primary text-white ms-auto"
          @click="save('Withdraw')"
        ></v-btn>
        <v-btn
          class="bg-error text-white"
          text="بستن"
          @click="model = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
