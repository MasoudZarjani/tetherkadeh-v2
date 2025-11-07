<script setup lang="ts">
import type { User } from "~/types/user.types";

const config = useRuntimeConfig();

const model = defineModel<boolean>();
defineProps<{
  user: User;
}>();
</script>

<template>
  <v-dialog v-model="model" max-width="800">
    <v-card>
      <v-card-text>
        <div v-for="(item, index) in user.docs" :key="index">
          <img
            :src="`${config.public.baseURL}${item?.url}`"
            v-if="item?.url"
            style="max-width: 100%"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ms-auto" @click="model = false"> بستن </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
