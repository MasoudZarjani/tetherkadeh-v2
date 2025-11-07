<script setup lang="ts">
import { useDrawerStore } from "~/store/drawer";
import { useTheme } from "vuetify";

const { toggleSidebar } = useDrawerStore();

const router = useRouter();
const theme = useTheme();
const config = useRuntimeConfig();
const { data, signOut } = useAuth();

const user: any = data.value?.data;

const menus = ref([
  { title: "پروفایل", link: "profile", icon: "mdi-account" },
  { title: "تغییر پسورد", link: "change-password", icon: "mdi-key" },
  { title: "خروج", link: "./logout", icon: "mdi-logout" },
]);

onMounted(() => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "darkTheme") {
    theme.global.name.value = "darkTheme";
  } else {
    theme.global.name.value = "lightTheme";
  }
});

const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "darkTheme") {
    localStorage.setItem("theme", "lightTheme");
    theme.global.name.value = "lightTheme";
  } else {
    localStorage.setItem("theme", "darkTheme");
    theme.global.name.value = "darkTheme";
  }
};

const goTo = (link: string) => {
  if (link === "logout") {
    signOut({ callbackUrl: "/login" });
  }
  router.push(link);
};
</script>

<template>
  <v-app-bar prominent flat class="px-2">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="toggleSidebar"
    ></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn icon class="ml-2" @click="toggleTheme">
      <core-icon
        :name="theme.global.name.value === 'darkTheme' ? 'moon' : 'sun'"
        :fill="theme.global.name.value === 'darkTheme' ? '#FFFFFF' : '#000000'"
      ></core-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <span style="cursor: pointer" v-bind="props">
          <v-chip link rounded>
            <v-badge dot bottom color="green" offset-y="18" offset-x="2">
              <v-avatar size="26">
                <v-img
                  :src="
                    config.public.baseURL +
                    (user?.imagePath ?? '/default-profile.png')
                  "
                />
              </v-avatar>
            </v-badge>
            <span class="mr-3">{{ user?.firstName }} {{ user?.lastName }}</span>
          </v-chip>
        </span>
      </template>
      <v-list width="250" class="py-0">
        <v-list-item
          two-line
          :prepend-avatar="
            config.public.baseURL + (user?.imagePath ?? '/default-profile.png')
          "
          :title="user?.lastName"
          subtitle="وارد شدید"
          class="pa-4"
        ></v-list-item>
        <v-divider />
        <v-list-item
          link
          v-for="(menu, i) in menus"
          :key="i"
          :prepend-icon="menu.icon"
          :title="menu.title"
          @click="goTo(menu.link)"
        ></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
