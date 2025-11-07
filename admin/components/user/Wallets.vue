<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";
import type { Wallet } from "~/types/wallet.types";

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const api = useApi();
const { toggleOverlay } = useOverlayStore();
const headers: VDataTable["$props"]["headers"] = [
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  { title: "ارز", key: "coin", sortable: false, align: "center" },
  { title: "معادل تتری", key: "totalUSDT", sortable: false, align: "center" },
  { title: "معادل تومانی", key: "totalIRT", sortable: false, align: "center" },
];

const items: any = ref<Wallet>();
const loading = ref(false);

onMounted(async () => {
  await getData();
});

const getData = async () => {
  toggleOverlay(true);
  loading.value = true;
  try {
    const data: any = await api.get(`/api/v1/wallet/admin/${props.userId}`);
    items.value = data?.data;
  } finally {
    loading.value = false;
    toggleOverlay(false);
  }
};
</script>

<template>
  <v-card title="کیف پول" flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>
      <v-btn @click="getData" icon :disabled="loading">
        <v-icon :class="{ spin: loading }">mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.row="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:item.totalUSDT="{ item }: any">
        {{ useDigitNumber(item.totalUSDT, 4) }} تتر
      </template>

      <template v-slot:item.totalIRT="{ item }: any">
        {{ useDigitNumber(item.totalIRT, 2) }} تومان
      </template>
    </v-data-table>
  </v-card>
</template>
