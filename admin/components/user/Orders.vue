<script setup lang="ts">
import type { Order } from "~/types/order.types";
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";

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
  {
    title: "ارز",
    key: "coin",
    sortable: false,
    align: "center",
  },
  { title: "نوع سفارش", key: "side", sortable: false, align: "center" },
  { title: "قیمت", key: "price", sortable: false, align: "center" },
  { title: "مقدار", key: "amount", sortable: false, align: "center" },
  { title: "کد رهگیری", key: "trackId", sortable: false, align: "center" },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
];
const search = ref("");
const items: any = ref<Order>();
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

onMounted(async () => {
  await getData();
});

const getData = async () => {
  toggleOverlay(true);
  loading.value = true;
  try {
    const data: any = await api.get(
      `/api/v1/order/admin?page=${page.value}&limit=${itemsPerPage.value}&side=all&search=${search.value}&userId=${props.userId}`
    );
    items.value = data?.data;
    totalItems.value = data?.total;
  } finally {
    loading.value = false;
    toggleOverlay(false);
  }
};

const rowNumber = (_id: string) => {
  return (
    itemsPerPage.value * (page.value - 1) +
    items.value
      .map(function (x: any) {
        return x._id;
      })
      .indexOf(_id) +
    1
  );
};
</script>

<template>
  <v-card title="لیست سفارشات" flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-text-field
        :value="search"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        label="جستجو"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn @click="getData" icon :disabled="loading">
        <v-icon :class="{ spin: loading }">mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      v-model:page="page"
      :search="search"
      item-value="_id"
      @update:options="getData"
    >
      <template v-slot:item.row="{ item }: any">
        {{ rowNumber(item._id) }}
      </template>
      <template v-slot:item.coin="{ item }: any">
        {{ item.symbol.symbol }}-{{ item.pairSymbol.symbol }}
      </template>
      <template v-slot:item.side="{ item }: any">
        <v-chip :color="item.side === 'Buy' ? 'success' : 'error'">
          {{ item.side === "Buy" ? "خرید" : "فروش" }}
        </v-chip>
      </template>
      <template v-slot:item.price="{ item }: any">
        {{ useDigitNumber(item.price, 2) }}
      </template>
      <template v-slot:item.amount="{ item }: any">
        {{ useDigitNumber(item.amount, 2) }}
      </template>
      <template v-slot:item.createdAt="{ item }: any">
        {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
      </template>
    </v-data-table-server>
  </v-card>
</template>
