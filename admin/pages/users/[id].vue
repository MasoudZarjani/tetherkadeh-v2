<script setup lang="ts">
import { useOverlayStore } from "~/store/overlay";

definePageMeta({
  auth: true,
  breadcrumbs: "پنل مدیریت",
  pageTransition: {
    name: "rotate",
  },
});
const { toggleOverlay } = useOverlayStore();
const route = useRoute();
const api = useApi();

const tab = ref(1);
const showDepositDialog = ref(false);
const showWithdrawDialog = ref(false);
const showLimitedDialog = ref(false);
const showDocumentDialog = ref(false);
const user: any = ref();
const inviter: any = ref();

onMounted(async () => {
  await getUserData();
});

const getUserData = async () => {
  toggleOverlay(true);
  const data: any = await api.get(`/api/v1/user/admin/${route.params.id}`);
  user.value = data;
  toggleOverlay(false);
};
</script>
<template>
  <div v-if="user">
    <UserDocumentDialog v-model="showDocumentDialog" :user="user" />
    <UserLimitDialog
      v-model="showLimitedDialog"
      :userId="route.params.id.toString()"
    />
    <UserWithdrawDialog
      v-model="showWithdrawDialog"
      :userId="route.params.id.toString()"
    />
    <UserChargeWalletDialog
      v-model="showDepositDialog"
      :userId="route.params.id.toString()"
    />
    <UserProfileCard
      :user="user"
      :inviter="inviter"
      @deposit="showDepositDialog = true"
      @withdraw="showWithdrawDialog = true"
      @limit="showLimitedDialog = true"
      @show-documents="showDocumentDialog = true"
    />
    <v-card flat class="mt-4">
      <v-tabs v-model="tab">
        <v-tab :value="1">اقدامات</v-tab>
        <v-tab :value="2">حساب های بانکی</v-tab>
        <v-tab :value="3">کیف پول</v-tab>
        <v-tab :value="4">تراکنش ها</v-tab>
        <v-tab :value="5">سفارش ها</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="1">
          <UserAction :user="user" />
        </v-window-item>
        <v-window-item :value="2">
          <UserBankAccounts :userId="route.params.id.toString()" />
        </v-window-item>
        <v-window-item :value="3">
          <UserWallets :userId="route.params.id.toString()" />
        </v-window-item>
        <v-window-item :value="4">
          <UserTransactions :userId="route.params.id.toString()" />
        </v-window-item>
        <v-window-item :value="5">
          <UserOrders :userId="route.params.id.toString()" />
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>
