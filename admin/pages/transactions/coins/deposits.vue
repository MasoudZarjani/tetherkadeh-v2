<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

const { toggleOverlay } = useOverlayStore();
const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "لیست واریز های ارزی",
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
const selectedItem: any = ref();
const trackingCodeDialog = ref(false);
const questionDialog = ref(false);
const trackingCode = ref("");
const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  {
    title: "اطلاعات کاربر",
    key: "name",
    sortable: false,
    align: "start",
  },
  { title: "مبلغ", key: "amount", sortable: false, align: "center" },
  { title: "ارز", key: "coin", sortable: false, align: "center" },
  { title: "شبکه", key: "network", sortable: false, align: "center" },
  {
    title: "هش تراکنش",
    key: "transactionId",
    sortable: false,
    align: "center",
  },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
  { title: "عملیات", key: "action", sortable: false, align: "center" },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  loading.value = true;
  try {
    const data: any = await api.get(
      `/api/v1/wallet/admin/list?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}&type=Deposit&transactionType=Coin`
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

const showTrackingCodeDialog = (item: any) => {
  selectedItem.value = item;
  trackingCodeDialog.value = true;
};

const showQuestionDialog = (item: any) => {
  selectedItem.value = item;
  questionDialog.value = true;
};

const confirm = async (status: string) => {
  trackingCodeDialog.value = false;
  toggleOverlay(true);
  try {
    let payload = null;
    if (status === "Active") {
      payload = {
        status,
        trackingCode: trackingCode.value,
        transactionId: selectedItem.value.transactionId,
        walletId: selectedItem.value._id,
      };
    } else {
      payload = {
        status,
        transactionId: selectedItem.value.transactionId,
        walletId: selectedItem.value._id,
      };
    }
    await api.put(`/api/v1/wallet/admin/change-status`, payload);
    getData();
  } finally {
    toggleOverlay(false);
  }
};
</script>
<template>
  <div>
    <v-dialog max-width="500" v-model="questionDialog">
      <v-card title="تغییر وضعیت">
        <v-card-text> از تغییر وضعیت تراکنش اطمینان دارید؟ </v-card-text>
        <template v-slot:actions>
          <v-btn
            text="بله"
            class="bg-primary text-white ms-auto"
            @click="confirm('Rejected')"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="خیر"
            @click="questionDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="trackingCodeDialog">
      <v-card title="تکمیل تراکنش">
        <v-card-text>
          <v-text-field
            v-model="trackingCode"
            label="کد رهگیری"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            text="تکمیل تراکنش"
            class="bg-primary text-white ms-auto"
            @click="confirm('Active')"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="بستن"
            @click="trackingCodeDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-card title="لیست واریز های ارزی" flat>
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
        <template v-slot:item.network="{ item }: any">
          {{ item.network.name }}
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
        <template v-slot:item.action="{ item }: any">
          <v-btn
            icon
            variant="text"
            @click="showTrackingCodeDialog(item)"
            v-if="item.status === 'Pending'"
          >
            <v-icon size="small" color="success">mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-if="item.status === 'Pending'"
            icon
            variant="text"
            @click="showQuestionDialog(item)"
          >
            <v-icon size="small" color="error">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
