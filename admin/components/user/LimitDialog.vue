<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

const api = useApi();
const model = defineModel<boolean>();
const limitWithdraw = ref(new Date());
const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();

const props = defineProps<{
  userId: string;
}>();

const setLimit = async () => {
  toggleOverlay(true);
  try {
    const payload = {
      date: limitWithdraw.value,
    };
    await api.put(`/api/v1/user/admin/withdraw-limit/${props.userId}`, payload);
    showAlert({ text: "محدودیت با موفقیت اعمال شد.", color: "success" });
  } finally {
    toggleOverlay(false);
  }
};
</script>

<template>
  <v-dialog max-width="500" v-model="model">
    <v-card title="محدودیت برداشت">
      <v-card-text>
        <v-text-field
          label="تاریخ محدودیت"
          color="primary"
          variant="outlined"
          hide-details
          persistentPlaceholder
          :placeholder="limitWithdraw.toLocaleDateString()"
          :value="limitWithdraw.toLocaleDateString()"
        >
          <template #append-inner>
            <v-btn icon flat
              ><v-icon>mdi-calendar</v-icon>
              <v-menu activator="parent">
                <v-date-picker
                  color="primary"
                  v-model="limitWithdraw"
                ></v-date-picker>
              </v-menu>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
      <template v-slot:actions>
        <v-btn
          text="ثبت محدودیت"
          class="bg-primary text-white ms-auto"
          @click="setLimit()"
        ></v-btn>
        <v-btn
          class="bg-error text-white"
          text="بستن"
          @click="model = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
