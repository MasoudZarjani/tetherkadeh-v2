<script setup lang="ts">
import { useDrawerStore } from "~/store/drawer";
import { useTheme } from "vuetify";

const { drawer } = storeToRefs(useDrawerStore());
const { data } = useAuth();
const user: any = data.value?.data;

const theme = useTheme();

const items: any = ref([
  {
    text: "داشبورد",
    icon: "dashboard",
    link: "/",
    rules: ["Admin", "Moderator", "Support", "Seo"],
  },
  {
    text: "کاربران",
    icon: "users",
    link: "/users",
    rules: ["Admin", "Moderator", "Support"],
  },
  {
    text: "ارزها",
    icon: "coins",
    link: "/coins",
    rules: ["Admin", "Moderator", "Support"],
  },
  {
    text: "شبکه ها",
    icon: "networks",
    link: "/networks",
    rules: ["Admin", "Moderator", "Support"],
  },
  {
    text: "سفارشات",
    icon: "orders",
    link: "/orders",
    rules: ["Admin", "Moderator", "Support"],
  },
  {
    text: "اطلاعیه ها",
    icon: "announcement",
    link: "/announcements",
    rules: ["Admin", "Moderator", "Support"],
  },
  {
    text: "تراکنش های ارزی",
    icon: "transactions-coins",
    children: [
      {
        text: "واریز",
        link: "/transactions/coins/deposits",
      },
      {
        text: "برداشت",
        link: "/transactions/coins/withdraws",
      },
    ],
    rules: ["Admin", "Moderator"],
  },
  {
    text: "تراکنش های بانکی",
    icon: "transactions-banks",
    children: [
      {
        text: "واریز",
        link: "/transactions/banks/deposits",
      },
      {
        text: "برداشت",
        link: "/transactions/banks/withdraws",
      },
    ],
    rules: ["Admin", "Moderator"],
  },
  {
    text: "بلاگ",
    icon: "blog",
    children: [
      {
        text: "لیست دسته بندی ها",
        link: "/blog/categories",
      },
      {
        text: "لیست برچسب ها",
        link: "/blog/tags",
      },
      {
        text: "لیست پست ها",
        link: "/blog/posts",
      },
    ],
    rules: ["Admin", "Moderator"],
  },
  {
    text: "تنظیمات",
    icon: "setting",
    children: [
      {
        text: "عمومی",
        link: "/settings/general",
      },
      {
        text: "شبکه های اجتماعی",
        link: "/settings/socials",
      },
      {
        text: "پیام ها",
        link: "/settings/messages",
      },
      {
        text: "درگاه پرداخت",
        link: "/settings/gateway",
      },
      {
        text: "اکشن پیام ها",
        link: "/settings/action-message",
      },
      {
        text: "حساب های بانکی صرافی",
        link: "/settings/identifiedInfo",
      },
      {
        text: "مدیران",
        link: "/settings/admin",
      },
    ],
    rules: ["Admin", "Moderator"],
  },
  {
    text: "بارگذاری فایل",
    icon: "upload",
    link: "/upload",
    rules: ["Admin", "Moderator", "Support", "Seo"],
  },
]);

const checkRules = (item: any) => {
  if (!item.rules) return true;
  else {
    if (item.rules.includes(user?.type)) return true;
    else return false;
  }
};
</script>
<template>
  <v-navigation-drawer v-model="drawer" class="dark" app>
    <div class="bg-gradient pa-4">
      <div class="text-center">
        <v-avatar size="64" class="mb-4">
          <v-img aspect-ratio="30" src="/logo.png"></v-img>
        </v-avatar>
        <h4>{{ user?.firstName }} {{ user?.lastName }}</h4>
      </div>
    </div>
    <v-divider></v-divider>
    <v-list class="py-0">
      <template v-for="(item, index) in items" :key="index">
        <v-list-group v-if="item.children" :value="item">
          <template v-slot:activator="{ props }" v-if="checkRules(item)">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <core-icon
                  :name="item.icon"
                  :fill="
                    theme.global.name.value === 'darkTheme'
                      ? '#FFFFFF'
                      : '#000000'
                  "
                ></core-icon>
              </template>
              <v-list-item-content>
                <v-list-item-title class="pr-2">{{
                  item.text
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
            prepend-icon="mdi-circle-small"
            :title="child.text"
            :value="child"
            :to="child.link"
            style="padding-inline-start: 1.5rem !important"
          ></v-list-item>
        </v-list-group>
        <span v-else>
          <v-list-item v-if="checkRules(item)" :to="item.link">
            <template v-slot:prepend>
              <core-icon
                :name="item.icon"
                :fill="
                  theme.global.name.value === 'darkTheme'
                    ? '#FFFFFF'
                    : '#000000'
                "
              ></core-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title class="mr-2">{{
                item.text
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </span>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
