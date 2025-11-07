<script setup lang="ts">
definePageMeta({
  auth: true,
  breadcrumbs: "اطلاعیه ها",
});

const {
  itemsPerPage,
  items,
  totalItems,
  isLoading,
  search,
  page,
  valid,
  rules,
  deleteDialog,
  formModel,
  dialog,
  isEditing,
  importanceOptions,
  headers,
  selectedImportance,
  getData,
  add,
  edit,
  save,
  rowNumber,
  confirmDelete,
  deleteItem,
} = await useAnnouncement();
</script>

<template>
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card
      title="حذف دسته بندی"
      subtitle="آیا مطمئن هستید که می‌خواهید این دسته بندی را حذف کنید؟"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="plain"
          text="انصراف"
          @click="deleteDialog = false"
        ></v-btn>
        <v-btn color="error" text="حذف" @click="deleteItem"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="`${isEditing ? 'ویرایش' : 'افزودن'} دسته بندی سوالات متداول`"
      :title="`${isEditing ? 'ویرایش' : 'افزودن'} دسته بندی سوالات متداول`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formModel.title"
              label="عنوان"
              outlined
              :rules="[rules.required]"
              :error-messages="valid ? '' : 'عنوان الزامی است.'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              v-model="formModel.body"
              label="متن"
              outlined
              :rules="[rules.required]"
              :error-messages="valid ? '' : 'متن الزامی است.'"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="12">
            <v-select
              v-model="selectedImportance"
              :items="importanceOptions"
              item-title="title"
              item-value="value"
              label="اهمیت"
              outlined
              :rules="[rules.required]"
              :error-messages="valid ? '' : 'انتخاب اهمیت الزامی است.'"
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-switch
              v-model="formModel.status"
              label="فعال"
              color="primary"
              :rules="[rules.required]"
              :error-messages="valid ? '' : 'وضعیت الزامی است.'"
            ></v-switch>
          </v-col>
        </v-row>
      </template>
      <v-divider></v-divider>
      <v-card-actions class="bg-surface-light">
        <v-btn text="رد کردن" variant="plain" @click="dialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="ذخیره" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card title="لیست اطلاعیه ها" flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-text-field
        v-model="search"
        label="جستجو"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn
        class="me-2"
        prepend-icon="mdi-plus"
        rounded="lg"
        text="افزودن اطلاعیه"
        border
        @click="add"
      ></v-btn>
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
      <template v-slot:item.importance="{ item }: any">
        <v-chip
          :color="
            item.importance === 'Info'
              ? 'blue'
              : item.importance === 'Warning'
              ? 'yellow'
              : item.importance === 'Error'
              ? 'red'
              : 'green'
          "
          text-color="white"
        >
          {{
            item.importance === "Info"
              ? "اطلاعیه"
              : item.importance === "Warning"
              ? "هشدار"
              : item.importance === "Error"
              ? "خطا"
              : "موفق"
          }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }: any">
        <v-btn
          variant="plain"
          color="primary"
          @click="edit(item._id)"
          prepend-icon="mdi-pencil"
        ></v-btn>
        <v-btn
          variant="plain"
          color="error"
          @click="confirmDelete(item._id)"
          prepend-icon="mdi-delete"
        ></v-btn>
      </template>
      <template v-slot:item.status="{ item }: any">
        <v-switch
          v-model="item.status"
          :label="item.status ? 'فعال' : 'غیرفعال'"
          color="primary"
          disabled
        ></v-switch>
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
      <template v-slot:item.updatedAt="{ item }: any">
        {{ new Date(item.updatedAt).toLocaleDateString("fa-IR") }}
        {{
          new Date(item.updatedAt).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </template>
    </v-data-table-server>
  </v-card>
</template>
