<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

const { toggleOverlay } = useOverlayStore();
const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "لیست واریز های بانکی",
  pageTransition: {
    name: "rotate",
  },
});

const itemsPerPage = ref(10);
const items: any = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref("");
const page = ref(1);
const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  {
    title: "اطلاعات کاربر",
    key: "name",
    sortable: false,
    align: "start",
  },
  { title: "مبلغ", key: "amount", sortable: false, align: "center" },
  { title: "درگاه", key: "gateway", sortable: false, align: "center" },
  {
    title: "کد رهگیری",
    key: "trackingCode",
    sortable: false,
    align: "center",
  },
  {
    title: "کارت بانکی",
    key: "bankAccount",
    sortable: false,
    align: "center",
  },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  loading.value = true;
  try {
    const data: any = await api.get(
      `/api/v1/wallet/admin/list?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}&type=Deposit&transactionType=Payment`
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
  <div>
    <v-card title="لیست واریز های بانکی" flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="search"
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
        <template v-slot:item.name="{ item }: any">
          <v-list-item
            @click="$router.push(`/users/${item.user?._id}`)"
            class="no-over"
            lines="two"
            :subtitle="item?.user?.mobile"
            :title="item?.user?.firstName + item?.user?.lastName"
          ></v-list-item>
        </template>
        <template v-slot:item.amount="{ item }: any">
          <span>{{ useDigitNumber(item.amount, 4) }} {{ item.coin }}</span>
        </template>
        <template v-slot:item.bankAccount="{ item }: any">
          {{ item.bankAccount.cardNumber }}
        </template>
        <template v-slot:item.createdAt="{ item }: any">
          {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
        </template>
        <template v-slot:item.status="{ item }: any">
          <span class="text-success" v-if="item.status === 'Active'">
            فعال
          </span>
          <span class="text-error" v-else-if="item.status === 'Deleted'">
            حذف شده
          </span>
          <span v-else-if="item.status === 'Inactive'" class="text-warning">
            غیرفعال
          </span>
          <span v-else-if="item.status === 'Pending'" class="text-warning">
            در انتظار
          </span>
          <span class="text-error" v-else-if="item.status === 'Rejected'">
            رد شده
          </span>
          <span v-else> نامشخص </span>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
