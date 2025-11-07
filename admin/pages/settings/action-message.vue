<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";
import type { VDataTable } from "vuetify/components";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-json"; // Load the language definition file used below
import "ace-builds/src-noconflict/theme-monokai"; // Load the theme definition file used below

const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const { token } = useAuth();
const config = useRuntimeConfig();
const api = useApi();

type ReadonlyHeaders = VDataTable["$props"]["headers"];

definePageMeta({
  auth: true,
  breadcrumbs: "تنظیمات اکشن پیام ها",
  pageTransition: {
    name: "rotate",
  },
});

const items: any = ref(null);

onMounted(() => {
  getData();
});

const getData = async () => {
  toggleOverlay(true);
  items.value = await api.get("/api/v1/setting");
  toggleOverlay(false);
};

const messageData = ref({
  type: [],
  kavenegar: "",
  melipayamak: "",
  titleFa: "",
  titleEn: "",
  messageFa: "",
  messageEn: "",
  descriptionFa: "",
  descriptionEn: "",
  emailTemplateFa: "",
  emailTemplateEn: "",
});

const headers = ref<ReadonlyHeaders>([
  { title: "ردیف", key: "row", sortable: false },
  { title: "کد پیام", key: "codeMessage", sortable: false },
  { title: "عملیات", key: "actions", sortable: false },
]);
const selected: any = ref("");
const selectedKey = ref("");
const dialog = ref(false);
const typeList = ref([
  { text: "پیامک", value: "SMS" },
  { text: "پست الکترونیکی", value: "EMAIL" },
  { text: "لاگ", value: "LOG" },
]);
const languages = ref([
  { text: "فارسی", value: "fa" },
  { text: "انگلیسی", value: "en" },
]);
const selectedLanguage = ref("fa");
const isLoading = ref(false);

const save = async () => {
  toggleOverlay(true);
  isLoading.value = true;
  items.value.codeMessage[selectedKey.value].type = messageData.value.type;
  items.value.codeMessage[selectedKey.value].kavenegar =
    messageData.value.kavenegar;
  items.value.codeMessage[selectedKey.value].melipayamak =
    messageData.value.melipayamak;
  items.value.codeMessage[selectedKey.value].title.fa =
    messageData.value.titleFa;
  items.value.codeMessage[selectedKey.value].title.en =
    messageData.value.titleEn;
  items.value.codeMessage[selectedKey.value].description.fa =
    messageData.value.descriptionFa;
  items.value.codeMessage[selectedKey.value].description.en =
    messageData.value.descriptionEn;
  items.value.codeMessage[selectedKey.value].message.fa =
    messageData.value.messageFa;
  items.value.codeMessage[selectedKey.value].message.en =
    messageData.value.messageEn;
  items.value.codeMessage[selectedKey.value].emailTemplate.fa =
    messageData.value.emailTemplateFa;
  items.value.codeMessage[selectedKey.value].emailTemplate.en =
    messageData.value.emailTemplateEn;

  try {
    await api.post("/api/v1/setting/bulk", { settings: items.value });
  } finally {
    isLoading.value = false;
    dialog.value = false;
    toggleOverlay(false);
  }
};

const messages = computed(() => {
  if (items.value) {
    console.log(items.value);
    var result = Object.entries(items.value.codeMessage);
    return result.map((item: any) => {
      return { codeMessage: item[0], actions: "" };
    });
  }
  return [];
});

const rowNumber = (codeMessage: string) => {
  return (
    messages.value.findIndex((item: any) => item.codeMessage === codeMessage) +
    1
  );
};

const showEditDialog = (item: any) => {
  selectedKey.value = item.codeMessage;
  selected.value = items.value.codeMessage[item.codeMessage];
  messageData.value = {
    type: selected.value.type,
    kavenegar: selected.value.kavenegar,
    melipayamak: selected.value.melipayamak,
    titleFa: selected.value.title.fa,
    titleEn: selected.value.title.en,
    descriptionEn: selected.value.description.en,
    descriptionFa: selected.value.description.fa,
    messageEn: selected.value.message.en,
    messageFa: selected.value.message.fa,
    emailTemplateFa: selected.value.emailTemplate.fa,
    emailTemplateEn: selected.value.emailTemplate.en,
  };
  dialog.value = true;
};
</script>

<template>
  <div v-if="items">
    <v-dialog max-width="900" v-model="dialog">
      <v-card>
        <v-card-title class="text-white bg-primary">
          ویرایش اکشن پیام
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="messageData.type"
                :items="typeList"
                label="نحوه ثبت پیام"
                multiple
                item-title="text"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="messageData.kavenegar"
                label="الگوی کاوه نگار"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="messageData.melipayamak"
                label="الگوی ملی پیامک"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="selectedLanguage"
                :items="languages"
                label="زبان متن"
                item-title="text"
                item-value="value"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" v-if="selectedLanguage === 'fa'">
              <v-text-field
                v-model="messageData.titleFa"
                label="عنوان پیام"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" v-else>
              <v-text-field
                v-model="messageData.titleEn"
                label="عنوان پیام"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" v-if="selectedLanguage === 'fa'">
              <v-textarea
                v-model="messageData.messageFa"
                label="متن پیام"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" v-else>
              <v-textarea
                v-model="messageData.messageEn"
                label="متن پیام"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" v-if="selectedLanguage === 'fa'">
              <v-textarea
                v-model="messageData.descriptionFa"
                label="متن توضیحات"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" v-else>
              <v-textarea
                v-model="messageData.descriptionEn"
                label="متن توضیحات"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <v-col cols="12" v-if="selectedLanguage === 'fa'">
              <v-ace-editor
                v-model:value="messageData.emailTemplateFa"
                lang="json"
                theme="monokai"
                style="height: 250px"
              />
            </v-col>
            <v-col cols="12" v-else>
              <v-ace-editor
                v-model:value="messageData.emailTemplateEn"
                lang="json"
                theme="monokai"
                style="height: 250px"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p class="border pa-4">
                پارامتر هایی که می توانید در بخش ساخت قالب ایمیل استفاده نمائید:
                <br />
                <span class="bg-green">{ logo }</span> : لوگو ایمیل
                <br />
                <span class="bg-green">{ title }</span> : عنوان ایمیل
                <br />
                <span class="bg-green">{ message }</span> : پیام ایمیل
                <br />
                <span class="bg-green">{ description }</span> : توضیحات اضافی
                ایمیل
                <br />
                <span class="bg-green">{ code }</span> : کد (در صورت داشتن کد)
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            text="ویرایش پیام"
            class="bg-primary text-white ms-auto"
            @click="save()"
          ></v-btn>
          <v-btn
            class="bg-error text-white"
            text="بستن"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-card title="تنظیمات پیام ها">
      <v-data-table :headers="headers" :items="messages" :loading="isLoading">
        <template v-slot:item.row="{ item }: any">
          {{ rowNumber(item.codeMessage) }}
        </template>
        <template v-slot:item.actions="{ item }: any">
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
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
