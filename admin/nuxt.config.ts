// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      htmlAttrs: { dir: "rtl", lang: "fa" },
      meta: [
        { content: "yse", name: "apple-mobile-web-app-capable" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        {
          name: "application-name",
          content: "تترکده",
        },
        {
          name: "msapplication-TileImage",
          content: "favicon-32x32.png",
        },
        {
          name: "msapplication-TileColor",
          content: "#155dfc",
        },
        {
          name: "theme-color",
          content: "#155dfc",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "shortcut icon",
          sizes: "16x16 24x24 32x32 48x48 64x64",
          href: "/favicon.ico",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/eslint",
    "@nuxt/image",
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // automatically imports `defineStore`
          "defineStore",
        ],
      },
    ],
    "@vite-pwa/nuxt",
    "@sidebase/nuxt-auth",
  ],
  css: [
    "~/assets/css/font.css",
    "~/assets/css/main.css",
    "~/assets/scss/main.scss",
  ],
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    baseURL: "https://api.tetherkade.com/api/v1/admin",
    disableServerSideAuth: false,
    originEnvKey: "AUTH_ORIGIN",
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "login", method: "post" },
        signOut: false,
        signUp: false,
        getSession: {
          path: "profile",
          method: "get",
        },
      },
      pages: {
        login: "/login",
      },
      token: {
        signInResponseTokenPointer: "/data/token",
      },
      session: {
        dataType: {
          data: {
            _id: "string",
            firstName: "string",
            lastName: "string",
            email: "string",
            mobile: "string",
            lastActiveAt: "string",
            type: "string",
            imagePath: "string",
            status: "string",
          },
        },
      },
    },
    sessionRefresh: {
      enablePeriodically: 1000 * 60 * 60 * 24 * 7,
      enableOnWindowFocus: true,
    },
  },
  pwa: {
    manifest: {
      name: "Test App",
      short_name: "Test App",
      description: "Test App",
      theme_color: "#32CD32",
      icons: [
        {
          src: "android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    authOrigin: "https://api.tetherkade.com/api/v1/admin",
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "https://api.tetherkade.com",
    },
  },

  devServer: {
    port: 9000,
  },
});
