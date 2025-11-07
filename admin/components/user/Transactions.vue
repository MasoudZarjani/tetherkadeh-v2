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
  { title: "ارز", key: "coin", sortable: false, align: "center" },
  { title: "نوع معامله", key: "type", sortable: false, align: "center" },
  { title: "مقدار", key: "amount", sortable: false, align: "center" },
  { title: "قیمت", key: "priceFiat", sortable: false, align: "center" },
  {
    title: "نوع تراکنش",
    key: "transactionType",
    sortable: false,
    align: "center",
  },
  {
    title: "نوع معامله",
    key: "blockedFor",
    sortable: false,
    align: "center",
  },
  {
    title: "کد پیگیری",
    key: "trackingCode",
    sortable: false,
    align: "center",
  },
  {
    title: "شناسه پیگیری/UID",
    key: "transactionId",
    sortable: false,
    align: "center",
  },
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
      `/api/v1/wallet/admin/list?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}&type=all&transactionType=all&userId=${props.userId}`
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
  <v-card title="لیست تراکنش ها" flat>
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
      <template v-slot:item.type="{ item }: any">
        <span class="text-success" v-if="item.type === 'Deposit'"> واریز </span>
        <span class="text-error" v-else-if="item.type === 'Withdraw'">
          برداشت
        </span>
        <span v-else-if="item.type === 'Blocked'" class="text-warning">
          مسدود
        </span>
        <span v-else-if="item.type === 'Fee'"> فی </span>
        <span v-else> نامشخص </span>
      </template>
      <template v-slot:item.blockedFor="{ item }: any">
        <span v-if="item.blockedFor === 'NormalOrder'"> سفارش عادی </span>
        <span v-else-if="item.blockedFor === 'BookOrder'"> سفارش رزو </span>
        <span v-else-if="item.blockedFor === 'Payment'"> پرداخت </span>
        <span v-else> نامشخص </span>
      </template>
      <template v-slot:item.amount="{ item }: any">
        <span>{{ useDigitNumber(item.amount, 4) }} {{ item.coin }}</span>
      </template>
      <template v-slot:item.priceFiat="{ item }: any">
        <span>{{ useDigitNumber(item.priceFiat, 4) }} تومان</span>
      </template>
      <template v-slot:item.transactionType="{ item }: any">
        <span v-if="item.transactionType === 'Manual'"> دستی </span>
        <span v-else-if="item.transactionType === 'Fiat'"> فیات </span>
        <span v-else-if="item.transactionType === 'Withdraw'"> برداشت </span>
        <span v-else-if="item.transactionType === 'Trade'"> معامله </span>
        <span v-else-if="item.transactionType === 'Gift'"> هدیه </span>
        <span v-else-if="item.transactionType === 'Blocked'"> مسدود </span>
        <span v-else-if="item.transactionType === 'CommissionTrade'">
          کمیسیون معامله
        </span>
        <span v-else-if="item.transactionType === 'Commission'"> کمسیون </span>
        <span v-else-if="item.transactionType === 'Payment'"> پرداخت </span>
        <span v-else-if="item.transactionType === 'Order'"> سفارش </span>
        <span v-else-if="item.transactionType === 'Referral'">
          دعوت دوستان
        </span>
        <span v-else-if="item.transactionType === 'Internal'"> داخلی </span>
        <span v-else-if="item.transactionType === 'Coin'"> ارز </span>
        <span v-else-if="item.transactionType === 'Fee'"> فی </span>
        <span v-else> نامشخص </span>
      </template>
      <template v-slot:item.status="{ item }: any">
        <span class="text-success" v-if="item.status === 'Active'"> فعال </span>
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
      <template v-slot:item.createdAt="{ item }: any">
        {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
      </template>
    </v-data-table-server>
  </v-card>
</template>
