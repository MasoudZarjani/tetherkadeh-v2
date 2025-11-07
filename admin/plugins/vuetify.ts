// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";
import { fa } from "vuetify/locale";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md2 } from "vuetify/blueprints";
import "@/assets/scss/main.scss";
import colors from "vuetify/util/colors";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md2,
    locale: {
      locale: "fa",
      fallback: "fa",
      messages: { fa },
    },
    theme: {
      defaultTheme: "lightTheme",
      themes: {
        lightTheme: {
          dark: false,
          colors: {
            primary: colors.yellow.darken3,
            secondary: colors.teal.lighten4,
            background: "#f5f5f9",
            surface: "#ffffff",
          },
        },
        darkTheme: {
          dark: true,
          colors: {
            primary: colors.yellow.darken3,
            secondary: colors.teal.lighten4,
            background: colors.blueGrey.darken3,
            surface: colors.blueGrey.darken4,
          },
        },
      },
    },
    icons: {
      defaultSet: "mdi", // This is already the default value - only for display purposes
    },
  });
  app.vueApp.use(vuetify);
});
