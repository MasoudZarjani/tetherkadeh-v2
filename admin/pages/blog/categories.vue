<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useOverlayStore } from "~/store/overlay";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

const { toggleOverlay } = useOverlayStore();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "دسته بندی های بلاگ",
  pageTransition: {
    name: "rotate",
  },
});

const itemsPerPage = ref(10);
const items: any = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref("");
const dialog = ref(false);
const page = ref(1);
const editedItem = ref({
  name: "",
  slug: "",
});
const defaultItem = {
  name: "",
  slug: "",
};
const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  {
    title: "نام",
    key: "name",
    sortable: false,
    align: "start",
  },
  {
    title: "شناسه",
    key: "slug",
    sortable: false,
    align: "center",
  },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  loading.value = true;
  try {
    const data: any = await api.get(
      `/api/v1/blog/categories?page=${page.value}&limit=${itemsPerPage.value}&search=${search.value}`
    );
    items.value = data?.data;
    totalItems.value = data?.total;
  } finally {
    loading.value = false;
    toggleOverlay(false);
  }
};

const close = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
};

const save = async () => {
  toggleOverlay(true);
  try {
    await api.post(`/api/v1/blog/categories`, {
      name: editedItem.value.name,
      slug: editedItem.value.slug,
    });
    close();
    await getData(); // Refresh table
  } finally {
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
    <v-card title="دسته بندی های بلاگ" flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="search"
          label="جستجو"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon :class="{ spin: loading }">mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">افزودن دسته بندی</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="نام دسته بندی"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.slug"
                      label="شناسه (slug)"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" @click="close">
                انصراف
              </v-btn>
              <v-btn color="primary" variant="text" @click="save">
                ذخیره
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider vertical class="mx-2"></v-divider>
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
