<script setup lang="ts">
import type { VDataTable } from "vuetify/components";
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

type ReadonlyHeaders = VDataTable["$props"]["headers"];

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobile: string;
  email: string;
  postalCode: string;
  address: string;
  birthday: string;
  createdAt: string;
  imagePath: string;
  status: string;
  stepRequest: string;
  stepAuth: string;
  docs: Array<{ url: string }>;
  notes: string[];
  twoStepVerification: boolean;
  twoFactorVerification: boolean;
  uid: string;
}

interface StatusItem {
  text: string;
  value: string;
}

interface SortItem {
  key: string;
  order?: boolean | "asc" | "desc";
}

interface UserForm {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthday: string;
  mobile: string;
  email: string;
  postalCode: string;
  address: string;
  userId: string;
  twoStepVerification: boolean;
  twoFactorVerification: boolean;
}

// Stores and composables
const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const config = useRuntimeConfig();
const api = useApi();

// Page metadata
definePageMeta({
  auth: true,
  breadcrumbs: "کاربران",
  pageTransition: { name: "rotate" },
});

// State
const status = ref("all");
const itemsPerPage = ref(10);
const items = ref<User[]>([]);
const totalItems = ref(0);
const isLoading = ref(false);
const documentDialog = ref(false);
const reasonDialog = ref(false);
const notesDialog = ref(false);
const editDialog = ref(false);
const search = ref("");
const page = ref(1);
const selectedUser = ref<User | null>(null);
const note = ref("");
const sortBy = ref<SortItem[]>([{ key: "createdAt", order: "desc" }]);
const reason = ref("");
const notes = ref<string[]>([]);
const userId = ref("");
const isMobile = ref(false);

// Form validation
const valid = ref(true);
const lazy = ref(true);
const rules = {
  required: (value: string) => !!value || "الزامی می باشد.",
  min: (v: string) => (v && v.length >= 8) || "حداقل 8 کاراکتر",
  email: (v: string) =>
    (v && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
    "لطفا ایمیل را به درستی وارد کنید",
};

// Data
const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false, align: "center" },
  { title: "اطلاعات کاربر", key: "name", sortable: true, align: "start" },
  { title: "UID", key: "uid", sortable: false, align: "center" },
  {
    title: "کدملی / تاریخ تولد",
    key: "birthday",
    sortable: false,
    align: "center",
  },
  { title: "وضعیت احراز", key: "status", sortable: false, align: "center" },
  { title: "تاریخ ثبت نام", key: "createdAt", sortable: true, align: "center" },
  { title: "عملیات", key: "action", sortable: false, align: "center" },
]);

const mobileHeaders = ref<ReadonlyHeaders>([
  { title: "اطلاعات کاربر", key: "name", sortable: true, align: "start" },
  { title: "وضعیت", key: "status", sortable: false, align: "center" },
  { title: "عملیات", key: "action", sortable: false, align: "center" },
]);

const statusItems = ref<StatusItem[]>([
  { text: "همه", value: "all" },
  { text: "احراز شده", value: "Approved" },
  { text: "در انتظار احراز", value: "Pending" },
  { text: "در انتظار احراز اول", value: "PendingStep1" },
  { text: "در انتظار احراز دوم", value: "PendingStep2" },
  { text: "رد شده مرحله اول", value: "RejectStep1" },
  { text: "رد شده مرحله دوم", value: "RejectStep2" },
  { text: "تایید مرحله اول", value: "Step1" },
  { text: "مسدود شده", value: "Blocked" },
  { text: "تایید کامل", value: "Trusted" },
]);

const userDefault = ref<UserForm>({
  firstName: "",
  lastName: "",
  nationalCode: "",
  birthday: "",
  mobile: "",
  email: "",
  postalCode: "",
  address: "",
  userId: "",
  twoStepVerification: false,
  twoFactorVerification: false,
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 960;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

watch(
  () => status.value,
  () => {
    getData();
  }
);

watch(
  () => sortBy.value,
  () => {
    getData();
  }
);

watch(page, () => {
  getData();
});

watch(search, () => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  let direction = sortBy.value[0]?.order === "desc" ? "-1" : "1";
  let sort = sortBy.value[0]?.key || "createdAt";
  let url = "";
  if (
    status.value === "all" ||
    status.value === "Approved" ||
    status.value === "Pending" ||
    status.value === "Trusted" ||
    status.value === "Blocked"
  )
    url = `status=${status.value}`;
  else url = `status=all&stepRequest=${status.value}`;
  if (search.value) url = url + `&search=${search.value}`;
  const data: any = await api.get(
    `/api/v1/user/admin?page=${page.value}&limit=${itemsPerPage.value}&sort=${sort}&order=${direction}&${url}`
  );
  items.value = data.data;
  totalItems.value = data.total;
  isLoading.value = false;
  toggleOverlay(false);
};

const rowNumber = (id: string) => {
  return (
    itemsPerPage.value * (page.value - 1) +
    items.value.findIndex((item) => item._id === id) +
    1
  );
};

const showDocuments = (user: User) => {
  documentDialog.value = true;
  selectedUser.value = user;
};

const verifyKyc = async () => {
  if (!selectedUser.value) return;

  try {
    toggleOverlay(true);
    isLoading.value = true;

    let step = "";
    if (
      ["PendingStep1", "RejectStep1"].includes(selectedUser.value.stepRequest)
    ) {
      step = "Step1";
    } else if (
      ["PendingStep2", "RejectStep2"].includes(selectedUser.value.stepRequest)
    ) {
      step = "Step2";
    } else {
      showAlert({ text: "امکان تایید نهایی کاربر وجود ندارد", color: "error" });
    }
    await api.put(`/api/v1/user/admin/set-step/${selectedUser.value._id}`, {
      step,
    });

    if (selectedUser.value.stepRequest === "PendingStep2") {
      await api.put(
        `/api/v1/user/admin/change-status/${selectedUser.value._id}`,
        {
          status: "Approved",
        }
      );
    }

    await getData();
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    reasonDialog.value = false;
    documentDialog.value = false;
  }
};

const resetKyc = async () => {
  if (!selectedUser.value) return;

  try {
    toggleOverlay(true);
    isLoading.value = true;

    await api.put(`/api/v1/user/admin/change-step/${selectedUser.value._id}`, {
      step: "None",
    });

    await api.put(
      `/api/v1/user/admin/change-status/${selectedUser.value._id}`,
      {
        status: "Register",
      }
    );

    await getData();
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    reasonDialog.value = false;
    documentDialog.value = false;
  }
};

const cancelKyc = async () => {
  if (!selectedUser.value || !reason.value) return;

  try {
    toggleOverlay(true);
    isLoading.value = true;

    const payload: { step: string; reason: string } = {
      step: "",
      reason: reason.value,
    };

    if (selectedUser.value.stepRequest === "PendingStep1") {
      payload.step = "RejectStep1";
    }
    if (selectedUser.value.stepRequest === "PendingStep2") {
      payload.step = "RejectStep2";
    }

    await api.put(
      `/api/v1/user/admin/set-step/${selectedUser.value._id}`,
      payload
    );
    await getData();
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
    reasonDialog.value = false;
    documentDialog.value = false;
  }
};

const showReasonDialog = () => {
  reasonDialog.value = true;
};

const showEditDialog = (item: any) => {
  userDefault.value.address = item.address;
  userDefault.value.birthday = item.birthday;
  userDefault.value.email = item.email;
  userDefault.value.mobile = item.mobile;
  userDefault.value.nationalCode = item.nationalCode;
  userDefault.value.firstName = item.firstName;
  userDefault.value.lastName = item.lastName;
  userDefault.value.postalCode = item.postalCode;
  userDefault.value.userId = item._id;
  userDefault.value.twoStepVerification = item.twoStepVerification;
  userDefault.value.twoFactorVerification = item.twoFactorVerification;
  editDialog.value = true;
};

const edit = async () => {
  try {
    toggleOverlay(true);
    isLoading.value = true;

    const { userId, ...userData } = userDefault.value;
    await api.put(`/api/v1/user/admin/${userId}`, userData);

    await getData();
    showAlert({ text: "اطلاعات با موفقیت ویرایش شد.", color: "success" });
    editDialog.value = false;
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
  }
};

const showNote = (user: User) => {
  notes.value = user.notes || [];
  userId.value = user._id;
  notesDialog.value = true;
};

const addNote = async () => {
  if (!note.value || !userId.value) return;

  try {
    toggleOverlay(true);
    isLoading.value = true;

    await api.put(`/api/v1/user/admin/add-note/${userId.value}`, {
      note: note.value,
    });

    showAlert({ text: "یادداشت شما با موفقیت ثبت شد.", color: "success" });
    await getData();
    notesDialog.value = false;
    note.value = "";
  } finally {
    isLoading.value = false;
    toggleOverlay(false);
  }
};

const getStatusText = (item: User) => {
  if (item.status === "Approved" || item.status === "Trusted") {
    return "احراز کامل";
  } else if (item.status === "Register") {
    if (item.stepRequest === "None" && item.stepAuth === "None")
      return "احراز نشده";
    if (item.stepRequest === "PendingStep1") return "در انتظار تایید مرحله اول";
    if (item.stepRequest === "PendingStep2") return "در انتظار تایید مرحله دوم";
    if (item.stepRequest === "Step1" && item.stepAuth === "Step1")
      return "تایید مرحله اول";
    if (item.stepRequest === "RejectStep1") return "رد شده مرحله اول";
    if (item.stepRequest === "RejectStep2") return "رد شده مرحله دوم";
  }
  return "احراز رد شده";
};

const getStatusColor = (item: User) => {
  if (item.status === "Approved" || item.status === "Trusted") return "success";
  if (item.status === "Register") {
    if (
      item.stepRequest === "PendingStep1" ||
      item.stepRequest === "PendingStep2"
    )
      return "warning";
    if (item.stepRequest === "Step1" && item.stepAuth === "Step1")
      return "info";
  }
  return "error";
};
</script>

<template>
  <div>
    <!-- Edit Dialog -->
    <v-dialog
      max-width="900"
      v-model="editDialog"
      fullscreen
      transition="dialog-bottom-transition"
      :scrim="false"
      class="d-md-none"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>بروزرسانی اطلاعات کاربر</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.firstName"
                :rules="[rules.required]"
                label="نام"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.lastName"
                :rules="[rules.required]"
                label="نام خانوادگی"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.nationalCode"
                :rules="[rules.required]"
                label="کد ملی"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.mobile"
                :rules="[rules.required]"
                label="موبایل"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.email"
                :rules="[rules.required]"
                label="ایمیل"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userDefault.postalCode"
                label="کد پستی"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="userDefault.address"
                label="آدرس"
                variant="outlined"
                rows="3"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="userDefault.twoFactorVerification"
                label="ورود دو مرحله ای"
                color="success"
              ></v-switch>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="userDefault.twoStepVerification"
                label="ورود با پیامک"
                color="success"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            block
            text="ویرایش کاربر"
            class="bg-primary text-white"
            size="large"
            @click="edit()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="900" v-model="editDialog" class="d-none d-md-block">
      <v-card title="بروزرسانی اطلاعات کاربر">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.firstName"
                :rules="[rules.required]"
                label="نام"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.lastName"
                :rules="[rules.required]"
                label="نام خانوادگی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.nationalCode"
                :rules="[rules.required]"
                label="کد ملی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.mobile"
                :rules="[rules.required]"
                label="موبایل"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.email"
                :rules="[rules.required]"
                label="ایمیل"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="userDefault.postalCode"
                label="کد پستی"
                variant="outlined"
                class="my-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="userDefault.address"
                label="آدرس"
                variant="outlined"
                class="my-2"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch
                v-model="userDefault.twoFactorVerification"
                label="ورود دو مرحله ای"
                color="success"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="3">
              <v-switch
                v-model="userDefault.twoStepVerification"
                label="ورود با پیامک"
                color="success"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            text="ویرایش کاربر"
            class="bg-primary text-white ms-auto"
            @click="edit()"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="بستن"
            @click="editDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <!-- Documents Dialog -->
    <v-dialog max-width="800" v-model="documentDialog">
      <v-card>
        <v-toolbar color="primary" class="d-md-none">
          <v-btn icon @click="documentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>مدارک احراز هویت</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-2 pa-md-4">
          <div
            v-for="(item, index) in selectedUser?.docs"
            :key="index"
            class="mb-2"
          >
            <img
              :src="`${config.public.baseURL}${item?.url}`"
              v-if="item?.url"
              style="max-width: 100%; border-radius: 8px"
            />
          </div>
        </v-card-text>
        <v-card-actions class="flex-column flex-md-row pa-3 pa-md-2 gap-2">
          <v-btn
            :text="
              selectedUser?.stepRequest === 'pendingStep2'
                ? 'تایید نهایی'
                : 'تایید'
            "
            class="bg-success text-white grow flex-md-grow-0"
            @click="verifyKyc()"
          ></v-btn>
          <v-btn
            text="رد"
            class="bg-error text-white grow flex-md-grow-0"
            @click="showReasonDialog()"
          ></v-btn>
          <v-btn
            text="ریست"
            class="bg-warning grow flex-md-grow-0"
            @click="resetKyc()"
          ></v-btn>
          <v-btn
            class="ms-md-auto grow flex-md-grow-0"
            text="بستن"
            @click="documentDialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Reason Dialog -->
    <v-dialog max-width="600" v-model="reasonDialog">
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
        class="my-4"
        @submit.prevent="cancelKyc()"
      >
        <v-card>
          <v-card-title class="pa-4">دلیل رد شدن</v-card-title>
          <v-card-text class="px-4">
            <v-textarea
              v-model="reason"
              :rules="[rules.required]"
              label="دلیل رد شدن"
              variant="outlined"
              rows="4"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="px-4 pb-4 flex-column flex-md-row gap-2">
            <v-btn
              text="ثبت"
              class="bg-success text-white grow flex-md-grow-0"
              type="submit"
            ></v-btn>
            <v-btn
              class="ms-md-auto grow flex-md-grow-0"
              text="بستن"
              @click="reasonDialog = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Notes Dialog -->
    <v-dialog max-width="600" v-model="notesDialog">
      <v-form
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
        class="my-4"
        @submit.prevent="addNote()"
      >
        <v-card>
          <v-card-title class="pa-4">یادداشت‌ها</v-card-title>
          <v-card-text class="px-4">
            <v-list v-if="notes.length > 0" class="mb-4">
              <v-list-item
                v-for="(noteItem, index) in notes"
                :key="index"
                class="bg-grey-lighten-4 mb-2 rounded"
              >
                <v-list-item-title>{{ noteItem }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-textarea
              v-model="note"
              :rules="[rules.required]"
              label="یادداشت جدید"
              variant="outlined"
              rows="4"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="px-4 pb-4 flex-column flex-md-row gap-2">
            <v-btn
              text="ثبت"
              class="bg-success text-white grow flex-md-grow-0"
              type="submit"
            ></v-btn>
            <v-btn
              class="ms-md-auto grow flex-md-grow-0"
              text="بستن"
              @click="notesDialog = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-card title="کاربران" flat>
      <v-card-title
        class="d-flex flex-column flex-md-row align-start align-md-center pe-2 gap-3"
      >
        <v-spacer class="d-none d-md-block"></v-spacer>
        <v-text-field
          v-model="search"
          label="جستجو"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          density="comfortable"
          class="grow flex-md-grow-0 ma-2"
          style="max-width: 100%; min-width: 250px"
        ></v-text-field>
        <v-select
          :items="statusItems"
          variant="outlined"
          hide-details
          label="وضعیت"
          v-model="status"
          item-title="text"
          item-value="value"
          density="comfortable"
          class="grow flex-md-grow-0 ma-2"
          style="max-width: 100%; min-width: 250px"
        ></v-select>
      </v-card-title>
      <!-- Mobile Card View -->
      <div v-if="isMobile" class="pa-2">
        <v-card
          v-for="item in items"
          :key="item._id"
          class="mb-3"
          elevation="2"
        >
          <v-card-text class="pb-2">
            <div class="d-flex justify-space-between align-start mb-2">
              <div class="grow">
                <div class="text-subtitle-1 font-weight-bold">
                  {{ item.firstName }} {{ item.lastName }}
                </div>
                <div class="text-caption text-grey">{{ item.mobile }}</div>
              </div>
              <v-chip :color="getStatusColor(item)" size="small">
                {{ getStatusText(item) }}
              </v-chip>
            </div>

            <v-divider class="my-2"></v-divider>

            <div class="text-caption">
              <div class="mb-1">
                <strong>کد ملی:</strong> {{ item.nationalCode }}
              </div>
              <div class="mb-1">
                <strong>شناسه کاربری:</strong> {{ item.uid }}
              </div>
              <div class="mb-1">
                <strong>تاریخ تولد:</strong>
                {{ new Date(item.birthday).toLocaleDateString("fa-IR") }}
              </div>
              <div>
                <strong>تاریخ ثبت نام:</strong>
                {{ new Date(item.createdAt).toLocaleDateString("fa-IR") }}
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn
              size="small"
              icon
              variant="text"
              @click="showEditDialog(item)"
            >
              <v-icon color="info">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              size="small"
              icon
              variant="text"
              @click="showDocuments(item)"
            >
              <v-icon color="warning">mdi-file-document</v-icon>
            </v-btn>
            <v-btn size="small" icon variant="text" @click="showNote(item)">
              <v-icon color="success">mdi-note-text</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              size="small"
              variant="tonal"
              @click="$router.push(`/users/${item._id}`)"
            >
              جزئیات
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-pagination v-model="page" :length="Math.ceil(totalItems / itemsPerPage)"></v-pagination>
      </div>
      <v-data-table-server
        v-else
        density="comfortable"
        fixed-header
        v-model:sort-by="sortBy"
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
          <v-list-item
            @click="$router.push(`/users/${item._id}`)"
            class="no-over no-truncate"
            lines="two"
            :subtitle="item?.mobile"
            :title="item?.firstName + ' ' + item?.lastName"
          ></v-list-item>
        </template>
        <template v-slot:item.birthday="{ item }: any">
          <v-list-item
            class="no-over"
            lines="two"
            :subtitle="new Date(item.birthday).toLocaleDateString('fa-IR')"
            :title="item?.nationalCode"
          ></v-list-item>
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
        <template v-slot:item.status="{ item }: any">
          <v-chip
            v-if="item.status === 'Approved' || item.status === 'Trusted'"
            color="success"
          >
            احراز کامل
          </v-chip>
          <span v-else-if="item.status === 'Register'">
            <v-chip
              color="error"
              v-if="item.stepRequest === 'None' && item.stepAuth === 'None'"
            >
              احراز نشده
            </v-chip>
            <v-chip color="warning" v-if="item.stepRequest === 'PendingStep1'">
              در انتظار تایید مرحله اول
            </v-chip>
            <v-chip color="warning" v-if="item.stepRequest === 'PendingStep2'">
              در انتظار تایید مرحله دوم
            </v-chip>
            <v-chip
              color="info"
              v-if="item.stepRequest === 'Step1' && item.stepAuth === 'Step1'"
            >
              تایید مرحله اول
            </v-chip>
            <v-chip color="error" v-if="item.stepRequest === 'RejectStep1'">
              رد شده مرحله اول
            </v-chip>
            <v-chip color="error" v-if="item.stepRequest === 'RejectStep2'">
              رد شده مرحله دوم
            </v-chip>
          </span>
          <v-chip v-else color="error"> احراز رد شده </v-chip>
        </template>
        <template v-slot:item.action="{ item }: any">
          <v-tooltip text="ویرایش" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                @click="showEditDialog(item)"
              >
                <core-icon name="pencil" fill="#4FC3F7"></core-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="نمایش مدارک احراز" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                @click="showDocuments(item)"
              >
                <core-icon name="documents" fill="#FDD835"></core-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="افزودن یادداشت" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="text" @click="showNote(item)">
                <core-icon name="note" fill="#00E676"></core-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>
