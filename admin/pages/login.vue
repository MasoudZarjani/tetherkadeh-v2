<script setup lang="ts">
import { useAlertStore } from "~/store/alert";
import { useOverlayStore } from "~/store/overlay";
import { useSettingStore } from "~/store/setting";

const { toggleOverlay } = useOverlayStore();
const { showAlert } = useAlertStore();
const { signIn } = useAuth();

definePageMeta({
  title: "ورود به پنل مدیریت",
  public: true,
  layout: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const isLoading = ref(false);
const valid = ref(true);
const lazy = ref(true);
const rules = ref({
  required: (value: string) => !!value || "الزامی می باشد.",
  min: (v: any) => (v && v.length >= 8) || "حداقل 8 کاراکتر",
  email: (v: any) =>
    (v && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) ||
    "لطفا ایمیل را به درستی وارد کنید",
});
const email = ref("");
const password = ref("");
const visible = ref(false);

const login = async () => {
  if (valid.value) {
    try {
      isLoading.value = true;
      toggleOverlay(true);
      const credentials = {
        user: email.value,
        password: password.value,
      };
      await signIn(credentials, { callbackUrl: "/", external: false });
    } catch (error: any) {
      if (error.data.messages)
        showAlert({ text: error.data.messages[0], color: "error" });
      else showAlert({ text: "خطای ارتباط با سرور", color: "error" });
    } finally {
      isLoading.value = false;
      toggleOverlay(false);
    }
  }
};
</script>

<template>
  <v-row no-gutters class="bg-blue-grey-darken-4">
    <v-col cols="12" class="d-flex align-center">
      <v-container>
        <div class="pa-sm-12">
          <v-row class="justify-center">
            <v-col md="8" lg="6" xl="4" cols="12">
              <v-card class="mx-auto bg-blue-grey-darken-3">
                <v-form
                  ref="form"
                  v-model="valid"
                  :lazy-validation="lazy"
                  class="my-4"
                  @submit.prevent="login"
                >
                  <v-card-text class="pa-9">
                    <v-row>
                      <v-col cols="12" class="text-center">
                        <div class="logo">
                          <img src="/logo.png" alt="logo" />
                        </div>
                        <h2 class="text-h4 my-8">داشبورد مدیریت</h2>
                        <v-text-field
                          v-model="email"
                          :rules="[rules.required, rules.email]"
                          label="پست الکترونیکی"
                          placeholder="Email address"
                          prepend-inner-icon="mdi-email-outline"
                          variant="outlined"
                          class="my-2"
                        ></v-text-field>
                        <v-text-field
                          v-model="password"
                          :append-inner-icon="
                            visible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :rules="[rules.required, rules.min]"
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
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="px-9">
                    <v-btn
                      block
                      type="submit"
                      color="primary"
                      size="x-large"
                      class="mb-5 bg-primary text-white"
                      flat
                      >ورود</v-btn
                    >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.logo img {
  width: 64px;
  object-fit: contain;
}
</style>
