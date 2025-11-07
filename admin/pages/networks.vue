<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";
import type { Network } from "~/types/network.types";

const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const { token } = useAuth();
const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "شبکه ها",
  pageTransition: {
    name: "rotate",
  },
});

const itemsPerPage = ref(10);
const items: any = ref<Network[]>([]);
const totalItems = ref(0);
const isLoading = ref(false);
const search = ref("");
const page = ref(1);
const editDialog = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const headers: VDataTable["$props"]["headers"] = [
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  { title: "نام شبکه", key: "name", sortable: false, align: "start" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
  { title: "عملیات", key: "action", sortable: false, align: "center" },
];

const rules = {
  required: (value: string) => !!value || "الزامی می باشد.",
  min: (v: any) => v?.length >= 8 || "حداقل 8 کاراکتر",
  email: (v: any) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "لطفا ایمیل را به درستی وارد کنید",
};

const defaultSymbol: Network = {
  name: "",
  persianName: "",
  slug: "",
  address: "",
  destinationTag: "",
  imagePath: "",
  minDeposit: 0,
  minWithdraw: 0,
  numberOfDecimal: 0,
  withdrawFee: 0,
  isWithdraw: false,
  isDeposit: false,
  messageWithdraw: "",
  messageDeposit: "",
  status: false,
  symbol: null,
};

const symbolItem = ref<Network>({ ...defaultSymbol });
const selectedId = ref("");

onBeforeMount(() => {
  getData();
});

const getData = async () => {
  try {
    toggleOverlay(true);
    isLoading.value = true;
    const { data, total }: any = await api.get(
      `/api/v1/network/admin?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}`
    );
    items.value = data;
    totalItems.value = total;
  } finally {
    toggleOverlay(false);
    isLoading.value = false;
  }
};

const rowNumber = (_id: string) =>
  itemsPerPage.value * (page.value - 1) +
  items.value.findIndex((x: any) => x._id === _id) +
  1;

const showEditDialog = (item: any) => {
  symbolItem.value = { ...item };
  selectedId.value = item._id;
  editDialog.value = true;
};

const onFileChanged = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) return;

  try {
    toggleOverlay(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    const response: any = await $fetch(
      `${config.public.baseURL}/api/v1/admin/upload`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: token.value || "" },
      }
    );
    symbolItem.value.imagePath = response.data.filename;
  } catch (error: any) {
    const message = error?.data?.messages?.[0] || "خطای ارتباط با سرور";
    showAlert({ text: message, color: "error" });
  } finally {
    toggleOverlay(false);
  }
};

function filterByKeys<T>(obj: Record<string, any>, keys: (keyof T)[]): T {
  const result = {} as T;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key as keyof typeof obj];
    }
  });
  return result;
}

const symbolKeys: (keyof Network)[] = [
  "name",
  "persianName",
  "slug",
  "symbol",
  "imagePath",
  "address",
  "destinationTag",
  "minDeposit",
  "minWithdraw",
  "isWithdraw",
  "isDeposit",
  "messageWithdraw",
  "messageDeposit",
  "status",
];

const edit = async () => {
  try {
    toggleOverlay(true);
    isLoading.value = true;
    const cleanedSymbol = filterByKeys<Network>(symbolItem.value, symbolKeys);
    await api.patch(`/api/v1/network/${selectedId.value}`, cleanedSymbol);
    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
    getData();
    editDialog.value = false;
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
  }
};
</script>

<template>
  <div>
    <v-dialog
      transition="dialog-bottom-transition"
      fullscreen
      v-model="editDialog"
    >
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="editDialog = false"></v-btn>

          <v-toolbar-title>ویرایش شبکه</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
              text="ویرایش شبکه"
              class="bg-primary text-white ms-auto"
              @click="edit()"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.name"
                type="text"
                :rules="[rules.required]"
                label="نام انگلیسی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.persianName"
                type="text"
                :rules="[rules.required]"
                label="نام پارسی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.slug"
                type="text"
                :rules="[rules.required]"
                label="نشانک"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.symbol"
                type="text"
                :rules="[rules.required]"
                label="ارز"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.address"
                type="text"
                label="آدرس ولت"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.destinationTag"
                type="text"
                label="تگ یا ممو"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-sheet class="pa-8 text-center" border="md opacity-12">
                <v-sheet class="mx-auto" height="100" width="100">
                  <img
                    :src="config.public.baseURL + symbolItem.imagePath"
                    v-if="symbolItem.imagePath"
                    width="100"
                  />
                </v-sheet>
                <input
                  type="file"
                  @change="onFileChanged"
                  class="d-none"
                  ref="fileInputRef"
                />
                <v-btn @click="fileInputRef?.click()" class="mt-4"
                  >انتخاب تصویر</v-btn
                >
              </v-sheet>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.minDeposit"
                type="number"
                label="حداقل واریز"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                v-model="symbolItem.minWithdraw"
                type="number"
                label="حداقل برداشت"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card title="تنظیمات شبکه ها" flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="search"
          label="جستجو"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :loading="isLoading"
        v-model:page="page"
        :search="search"
        item-value="_id"
        @update:options="getData"
      >
        <template v-slot:item.row="{ item }: any">
          {{ rowNumber(item._id) }}
        </template>
        <template v-slot:item.name="{ item }: any">
          <v-list>
            <v-list-item
              class="no-over"
              :prepend-avatar="config.public.baseURL + item.imagePath"
              :subtitle="item.persianName"
              :title="item.name"
            >
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.status="{ item }: any">
          <v-chip color="error" v-if="!item.status"> غیرفعال </v-chip>
          <v-chip color="success" v-else-if="item.status"> فعال </v-chip>
        </template>
        <template v-slot:item.action="{ item }: any">
          <v-btn icon variant="text" @click="showEditDialog(item)">
            <core-icon name="pencil" fill="#4FC3F7"></core-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
