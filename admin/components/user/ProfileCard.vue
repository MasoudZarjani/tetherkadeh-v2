<script setup lang="ts">
import type { User } from "~/types/user.types";

const props = defineProps<{
  user: User;
  inviter: User | null;
}>();

const emit = defineEmits(["deposit", "withdraw", "limit", "show-documents"]);

const authStatus = useAuthStatus(props.user);
</script>

<template>
  <v-img
    color="surface-variant"
    :height="$vuetify.display.mobile ? '100%' : '450'"
    :min-height="$vuetify.display.mobile ? '600' : '450'"
    src="https://random.imagecdn.app/1400/450?fit=fill"
    cover
    style="position: relative; border-radius: 4px"
  >
    <div
      :style="{
        position: $vuetify.display.mobile ? 'relative' : 'absolute',
        bottom: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '4px',
        backdropFilter: 'blur(5px)',
        minHeight: $vuetify.display.mobile ? '100%' : 'auto',
      }"
    >
      <v-row class="my-2 text-white">
        <!-- آواتار کاربر - در موبایل اول نمایش داده می‌شود -->
        <v-col
          cols="12"
          sm="12"
          lg="2"
          :order="$vuetify.display.lgAndUp ? 2 : 1"
          class="d-flex justify-center"
        >
          <div
            class="text-center"
            :class="$vuetify.display.mobile ? 'py-3' : 'top-spacer'"
          >
            <div class="avatar-border z-10">
              <v-badge :color="authStatus.color" :content="authStatus.text">
                <v-avatar
                  variant="flat"
                  class="userImage"
                  :size="$vuetify.display.mobile ? 80 : 100"
                >
                  <v-img alt="User" src="/public/user.jpg"></v-img>
                </v-avatar>
              </v-badge>
            </div>
            <h5
              :class="$vuetify.display.mobile ? 'text-h6 mt-2' : 'text-h5 mt-3'"
            >
              {{ user.firstName }} {{ user.lastName }}
            </h5>
            <div
              :class="
                $vuetify.display.mobile
                  ? 'text-body-2'
                  : 'text-h6 text-subtitle-1'
              "
            >
              {{ user.mobile }}
            </div>
          </div>
        </v-col>

        <!-- اطلاعات کاربر سمت چپ -->
        <v-col
          cols="12"
          sm="12"
          lg="5"
          :order="$vuetify.display.lgAndUp ? 1 : 2"
        >
          <div :class="$vuetify.display.mobile ? 'px-3 py-1' : 'px-4 py-1'">
            <v-row class="justify-center">
              <v-col cols="12" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">
                  پست الکترونیکی
                </div>
                <span class="text-caption">
                  {{ user?.email }}
                </span>
              </v-col>
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">دعوت کننده</div>
                <span class="text-caption">
                  <div v-if="inviter" class="text-caption">
                    {{ inviter?.firstName + " " + inviter?.lastName }}
                    <br />
                    <small>{{ inviter?.mobile }}</small>
                  </div>
                  <span v-else>---</span>
                </span>
              </v-col>
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">UID</div>
                <span class="text-caption">
                  {{ user.uid }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- اطلاعات اضافی سمت راست -->
        <v-col cols="12" sm="12" lg="5" :order="3">
          <div :class="$vuetify.display.mobile ? 'px-3 py-1' : 'px-4 py-1'">
            <v-row class="justify-center">
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">تاریخ تولد</div>
                <span class="text-caption">
                  {{ new Date(user.birthday).toLocaleDateString("fa-IR") }}
                </span>
              </v-col>
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">کد ملی</div>
                <span class="text-caption">
                  {{ user.nationalCode }}
                </span>
              </v-col>
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">
                  تاریخ ثبت نام
                </div>
                <span class="text-caption">
                  {{ new Date(user.createdAt).toLocaleDateString("fa-IR") }}
                </span>
              </v-col>
              <v-col cols="6" class="text-center py-2">
                <div class="text-body-2 font-weight-bold mb-1">کد ارسالی</div>
                <span class="text-caption">
                  {{ user.token }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>

      <!-- دکمه‌های عملیاتی -->
      <div :class="$vuetify.display.mobile ? 'px-3 pb-4 pt-2' : 'px-2 pb-2'">
        <v-row v-if="$vuetify.display.mobile" dense>
          <v-col cols="12" class="py-1">
            <v-btn
              variant="flat"
              color="success"
              @click="emit('deposit')"
              block
              size="small"
            >
              شارژ کیف پول
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-btn
              variant="flat"
              color="error"
              @click="emit('withdraw')"
              block
              size="small"
            >
              برداشت از کیف پول
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-btn
              variant="flat"
              color="warning"
              @click="emit('limit')"
              block
              size="small"
            >
              محدودیت برداشت
            </v-btn>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-btn
              variant="outlined"
              color="white"
              @click="emit('show-documents')"
              block
              size="small"
            >
              <v-icon start>mdi-file-document</v-icon>
              نمایش مدارک احراز
            </v-btn>
          </v-col>
        </v-row>

        <template v-else>
          <v-btn
            variant="flat"
            color="success"
            @click="emit('deposit')"
            class="mx-2"
          >
            شارژ کیف پول
          </v-btn>
          <v-btn
            variant="flat"
            color="error"
            @click="emit('withdraw')"
            class="mx-2"
          >
            برداشت از کیف پول
          </v-btn>
          <v-btn
            variant="flat"
            color="warning"
            @click="emit('limit')"
            class="mx-2"
          >
            محدودیت برداشت
          </v-btn>
          <v-tooltip text="نمایش مدارک احراز" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                @click="emit('show-documents')"
              >
                <v-icon>mdi-file-document</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </div>
    </div>
  </v-img>
</template>
