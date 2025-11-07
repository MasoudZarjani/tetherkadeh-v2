<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

const { toggleOverlay } = useOverlayStore();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "پست های بلاگ",
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
    title: "عنوان",
    key: "title",
    sortable: false,
    align: "start",
  },
  {
    title: "شناسه",
    key: "slug",
    sortable: false,
    align: "center",
  },
  {
    title: "دسته بندی",
    key: "category.name",
    sortable: false,
    align: "center",
  },
  {
    title: "برچسب ها",
    key: "tags",
    sortable: false,
    align: "center",
  },
  {
    title: "وضعیت انتشار",
    key: "published",
    sortable: false,
    align: "center",
  },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
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
      `/api/v1/blog/posts?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}`
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
    <v-card title="پست های بلاگ" flat>
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

        <template v-slot:item.createdAt="{ item }: any">
          {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
