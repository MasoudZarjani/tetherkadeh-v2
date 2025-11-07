<script setup lang="ts">
import { useOverlayStore } from "~/store/overlay";
import type { User } from "~/types/user.types";
import { useAlertStore } from "~/store/alert";

const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const api = useApi();
const emit = defineEmits(["getUserData"]);

defineProps<{
  user: User;
}>();

const changeStatus = async (userId: string, status: string) => {
  toggleOverlay(true);
  const payload = {
    status,
  };
  await api.put(`/api/v1/user/admin/change-status/${userId}`, payload);
  showAlert({ text: "وضعیت با موفقیت تغییر یافت.", color: "success" });
  toggleOverlay(false);
  emit("getUserData");
};
</script>

<template>
  <v-card>
    <v-card-text v-if="user.status !== 'Deleted'">
      <v-btn
        variant="flat"
        color="error"
        @click="changeStatus(user._id, 'Deleted')"
        class="mx-2"
      >
        حذف کاربر
      </v-btn>
      <v-btn
        v-if="user.status === 'Blocked'"
        variant="flat"
        color="success"
        @click="changeStatus(user._id, 'Register')"
        class="mx-2"
      >
        فعال سازی
      </v-btn>
      <v-btn
        v-else
        variant="flat"
        color="warning"
        @click="changeStatus(user._id, 'Blocked')"
        class="mx-2"
      >
        غیرفعال سازی
      </v-btn>
    </v-card-text>
  </v-card>
</template>
