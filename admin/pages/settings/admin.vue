<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";
import type { Admin } from "~/types/admin.types";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const { token } = useAuth();
const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  auth: true,
  breadcrumbs: "تنظیمات مدیریت",
});

const visible = ref(false);
const itemsPerPage = ref(10);
const items: any = ref([]);
const totalItems = ref(0);
const isLoading = ref(false);
const search = ref("");
const status = ref("all");
const defaultLevel = ref<Admin>({
  firstName: "",
  lastName: "",
  id: "",
  email: "",
  mobile: "",
  status: "",
  type: "Admin",
  imagePath: "",
  password: "",
});
const userItem = ref<Admin>(defaultLevel.value);
const page = ref(1);
const image = ref();
const imagePath = ref("");
const editDialog = ref(false);
const alertDialog = ref(false);
const isNew = ref(false);
const statusUser = ref("suspend");
const userId = ref("");
const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  { title: "نام و نام خانوادگی", key: "name", sortable: false, align: "start" },
  { title: "شماره تماس", key: "mobile", sortable: false, align: "center" },
  { title: "سطح مدیریت", key: "type", sortable: false, align: "center" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
  { title: "تاریخ ثبت", key: "createdAt", sortable: false, align: "center" },
  { title: "عملیات", key: "action", sortable: false, align: "center" },
]);
const rules = ref({
  required: (value: string) => !!value || "الزامی می باشد.",
  min: (v: any) => (v && v.length >= 8) || "حداقل 8 کاراکتر",
  email: (v: any) =>
    (v && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
    "لطفا ایمیل را به درستی وارد کنید",
});
const levels = ref([
  {
    text: "مدیر ارشد",
    value: "Admin",
  },
  {
    text: "مدیر",
    value: "Moderator",
  },
  {
    text: "پشتیبان",
    value: "Support",
  },
  {
    text: "سئو",
    value: "Seo",
  },
]);

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  try {
    const data: any = await api.get(
      `/api/v1/admin?page=${page.value}&limit=${itemsPerPage.value}&status=${status.value}`
    );
    console.log(data.data);
    items.value = data?.data;
    totalItems.value = data?.total;
  } finally {
    isLoading.value = false;
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

const onFileChanged = async ($event: any) => {
  try {
    toggleOverlay(true);
    const target = $event.target;
    if (target && target.files) {
      image.value = target.files[0];
    }
    let formData = new FormData();
    formData.append("file", image.value);
    const { data, error: errorItems } = await useFetch(
      `${config.public.baseURL}/api/v1/admin/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token.value || "",
        },
      }
    );
    if (errorItems.value) {
      showAlert({ text: errorItems.value.data.message[0], color: "error" });
      return;
    } else {
      const resp: any = data.value;
      imagePath.value = resp.url;
    }
  } catch (error) {
    showAlert({ text: "خطای ارتباط با سرور", color: "error" });
  } finally {
    toggleOverlay(false);
  }
};

const showEditDialog = (item: any) => {
  setItem(item);
  isNew.value = false;
  editDialog.value = true;
};

const showNewDialog = () => {
  userItem.value = { ...defaultLevel.value };
  isNew.value = true;
  editDialog.value = true;
};

const setItem = (item: any) => {
  userItem.value.id = item._id;
  userItem.value.firstName = item.firstName;
  userItem.value.lastName = item.lastName;
  userItem.value.mobile = item.mobile;
  userItem.value.imagePath = item.imagePath;
  userItem.value.email = item.email;
  userItem.value.status = item.status;
  userItem.value.type = item.type;
};

const edit = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  if (imagePath.value) userItem.value.imagePath = imagePath.value;
  try {
    userId.value = userItem.value.id || "";
    const payload = userItem.value;
    delete payload.id;
    delete payload.status;
    if (!payload.password) delete payload.password;
    console.log(userId.value);
    const data: any = await api.patch(
      `/api/v1/admin/${userId.value}`,
      userItem.value
    );

    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
    getData();
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    editDialog.value = false;
    alertDialog.value = false;
  }
};

const save = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  if (imagePath.value) userItem.value.imagePath = imagePath.value;
  try {
    const payload = userItem.value;
    delete payload.id;
    delete payload.status;
    const data: any = await api.post(`/api/v1/admin/register`, payload);
    
    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
    getData();
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    editDialog.value = false;
    alertDialog.value = false;
  }
};

const changeStatus = async () => {
  const payload = {
    status: statusUser.value,
  };
  try {
    toggleOverlay(true);
    isLoading.value = true;
    const { data, error: errorItems } = await useFetch(
      `${config.public.baseURL}/api/v1/admin/change-status/${userId.value}`,
      {
        method: "PATCH",
        body: payload,
        headers: {
          Authorization: token.value || "",
        },
      }
    );
    if (errorItems.value) {
      showAlert({ text: errorItems.value.data.message[0], color: "error" });
      return;
    } else {
      showAlert({ text: "وضعیت مدیر با موفقیت ویرایش شد.", color: "success" });
      getData();
    }
  } catch (error) {
    showAlert({ text: "خطای ارتباط با سرور", color: "error" });
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    editDialog.value = false;
    alertDialog.value = false;
  }
};

const showAlertDialog = async (status: string, id: string) => {
  statusUser.value = status;
  userId.value = id;
  alertDialog.value = true;
};

watch(
  () => status.value,
  () => {
    getData();
  }
);
</script>

<template>
  <div>
    <v-dialog max-width="500" v-model="alertDialog">
      <v-card title="تغییر وضعیت مدیر">
        <v-card-text> از تغییر وضعیت مدیر اطمینان دارید؟ </v-card-text>
        <template v-slot:actions>
          <v-btn
            text="بله"
            class="bg-primary text-white ms-auto"
            @click="changeStatus()"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="بستن"
            @click="alertDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog max-width="400" v-model="editDialog">
      <v-card :title="isNew ? 'ثبت مدیر جدید' : 'بروزرسانی اطلاعات کاربر'">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="userItem.firstName"
                :rules="[rules.required]"
                label="نام"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userItem.lastName"
                :rules="[rules.required]"
                label="نام خانوادگی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userItem.mobile"
                :rules="[rules.required]"
                label="شماره همراه"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userItem.email"
                :rules="[rules.required]"
                label="پست الکترونیکی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="userItem.type"
                :items="levels"
                label="وضعیت"
                variant="outlined"
                class="my-2"
                item-title="text"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userItem.password"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[rules.min]"
                :type="visible ? 'text' : 'password'"
                placeholder="رمز عبور را وارد نمایید."
                prepend-inner-icon="mdi-lock-outline"
                label="رمز عبور"
                hint="حداقل 8 کاراکتر"
                counter
                outlined
                variant="outlined"
                @click:append-inner="visible = !visible"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-file-input
                accept="image/*"
                label="آپلود تصویر"
                prepend-inner-icon="mdi-file-image"
                prepend-icon=""
                variant="outlined"
                show-size
                class="my-2"
                chips
                @change="onFileChanged($event)"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            :text="isNew ? 'ثبت' : 'ویرایش'"
            class="bg-primary text-white ms-auto"
            @click="isNew ? save() : edit()"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="بستن"
            @click="editDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-card title="مدیران" flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-spacer></v-spacer>
        <v-btn @click="showNewDialog()">افزودن</v-btn>
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
          {{ item.firstName }} {{ item.lastName }}
        </template>
        <template v-slot:item.type="{ item }: any">
          <v-chip v-if="item.type === 'Admin'" color="teal" size="x-small">
            مدیر ارشد
          </v-chip>
          <v-chip
            v-else-if="item.type === 'Moderator'"
            color="orange"
            size="x-small"
          >
            مدیر عادی
          </v-chip>
          <v-chip
            v-else-if="item.type === 'Support'"
            color="yellow"
            size="x-small"
          >
            پشتیبان
          </v-chip>
          <v-chip v-else-if="item.type === 'Seo'" color="purple" size="x-small">
            پشتیبان
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }: any">
          <v-chip
            v-if="item.status === 'Active'"
            color="success"
            size="x-small"
          >
            فعال
          </v-chip>
          <v-chip
            v-else-if="item.status === 'Deleted'"
            color="error"
            size="x-small"
          >
            حذف شده
          </v-chip>
          <v-chip v-else color="error" size="x-small"> معلق </v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }: any">
          {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
          {{
            new Date(item.createdAt).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </template>
        <template v-slot:item.action="{ item }: any">
          <v-btn
            icon
            variant="text"
            @click="showEditDialog(item)"
            v-if="item.status !== 'Deleted'"
          >
            <core-icon name="pencil" fill="#4FC3F7"></core-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            v-if="item.status === 'Active' && item.status !== 'Deleted'"
            @click="showAlertDialog('Suspend', item._id)"
          >
            <core-icon name="suspend" fill="#FF9800"></core-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            v-if="item.status === 'Suspend' && item.status !== 'Deleted'"
            @click="showAlertDialog('Active', item._id)"
          >
            <core-icon name="check" fill="#4CAF50"></core-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            v-if="item.status !== 'Deleted'"
            @click="showAlertDialog('Deleted', item._id)"
          >
            <core-icon name="delete" fill="#F44336"></core-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
