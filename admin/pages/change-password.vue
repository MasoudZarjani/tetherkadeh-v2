<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";

const { data, token } = useAuth();
const config = useRuntimeConfig();
const { showAlert } = useAlertStore();
const { toggleOverlay } = useOverlayStore();
const user: any = data.value?.data;

const userData = ref({
  password: "",
  confirmPassword: "",
});

const updateProfile = async () => {
  toggleOverlay(true);
  try {
    if (userData.value.password !== userData.value.confirmPassword) {
      showAlert({
        text: "رمز عبور و تکرار آن باید یکسان باشند.",
        color: "error",
      });
      return;
    }
    await $fetch(`${config.public.baseURL}/api/v1/admin/${user?._id}`, {
      method: "PATCH",
      body: userData.value,
      headers: {
        Authorization: token.value || "",
      },
    });
    showAlert({ text: "رمز عبور با موفقیت ویرایش شد.", color: "success" });
    useRouter().push("/logout");
  } catch (error: any) {
    if (error.data.messages)
      showAlert({ text: error.data.messages[0], color: "error" });
    else showAlert({ text: "خطای ارتباط با سرور", color: "error" });
  } finally {
    toggleOverlay(false);
  }
};
</script>
<template>
  <v-card>
    <v-card-title class="pa-4 bg-primary">تغییر رمز عبور</v-card-title>
    <v-card-text class="mt-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="رمز عبور"
            v-model="userData.password"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="تکرار رمز عبور"
            v-model="userData.confirmPassword"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="updateProfile">ویرایش</v-btn>
    </v-card-actions>
  </v-card>
</template>
