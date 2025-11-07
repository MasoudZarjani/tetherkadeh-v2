<script setup lang="ts">
import type { BankAccount } from "~/types/bankAccount.types";
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
  { title: "شماره کارت", key: "cardNumber", sortable: false, align: "center" },
  {
    title: "شماره حساب",
    key: "accountNumber",
    sortable: false,
    align: "center",
  },
  { title: "شماره شبا", key: "shebaNumber", sortable: false, align: "center" },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
];
const search = ref("");
const items: any = ref<BankAccount>();
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
      `/api/v1/bank-account/admin/${props.userId}?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}`
    );
    items.value = data.data;
    totalItems.value = data.total;
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
  <v-card title="حساب های بانکی" flat>
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

      <template v-slot:item.status="{ item }: any">
        <v-chip :color="item.status === 'Active' ? 'success' : 'error'">
          {{ item.status === "Active" ? "فعال" : "غیرفعال" }}
        </v-chip>
      </template>

      <template v-slot:item.createdAt="{ item }: any">
        {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
      </template>
    </v-data-table-server>
  </v-card>
</template>
