<script setup lang="ts">
import { useOverlayStore } from "~/store/overlay";
import { useTheme } from "vuetify";

const { toggleOverlay } = useOverlayStore();
const theme = useTheme();

definePageMeta({
  auth: true,
  breadcrumbs: "پنل مدیریت",
  pageTransition: {
    name: "rotate",
  },
});

const api = useApi();

const userCount = ref();
const isLoading = ref(false);

onBeforeMount(() => {
  getData();
});

const getData = async () => {
  try {
    toggleOverlay(true);
    isLoading.value = true;
    const data: any = await api.get(`/api/v1/admin/dashboard`);
    userCount.value = data.userCount;
  } finally {
    toggleOverlay(false);
    isLoading.value = false;
  }
};
</script>

<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="(item, index) in userCount"
          :key="index"
          sm="6"
          lg="3"
          cols="12"
          class="py-0 mb-3"
        >
          <v-card class="rounded-md">
            <v-card-text class="d-flex align-center">
              <core-icon
                class-name="ml-2"
                name="users"
                :fill="
                  theme.global.name.value === 'darkTheme'
                    ? '#FFFFFF'
                    : '#000000'
                "
              ></core-icon>
              <div>
                <h4 class="text-subtitle-1">{{ item.title }}</h4>
                <h2 class="text-h5">{{ item.value }}</h2>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>
