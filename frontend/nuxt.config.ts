import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import ViteRemoveConsole from 'vite-plugin-remove-console'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      // htmlAttrs: { dir: 'rtl', lang: 'fa-IR' },
      meta: [
        { content: 'yse', name: 'apple-mobile-web-app-capable' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        {
          name: 'application-name',
          content: 'تترکده',
        },
        {
          name: 'msapplication-TileImage',
          content: 'favicon-32x32.png',
        },
        {
          name: 'msapplication-TileColor',
          content: '#155dfc',
        },
        {
          name: 'theme-color',
          content: '#155dfc',
        },
      ],

      link: [
        {
          rel: 'preconnect',
          href: 'https://api.tetherkade.com',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'shortcut icon',
          sizes: '16x16 24x24 32x32 48x48 64x64',
          href: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      ],
    },
  },
  site: {
    url: 'https://tetherkade.com',
    name: 'صرافی تترکده',
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true },
    '/dashboard/**': { ssr: false } as any, // Client-side only for dashboard
    '/auth/**': { ssr: false } as any,
  },

  modules: [
    '@nuxt/image',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    'nuxt-vue3-google-signin',
    'nuxt-schema-org',
  ],

  nitro: {
    prerender: {
      crawlLinks: false, // ✅ Changed from true - don't auto-crawl
      routes: [
        '/', // Only prerender homepage
        '/robots.txt',
        '/sitemap.xml',
      ],
      // ✅ Ignore routes that cause errors
      ignore: [
        '/dashboard',
        '/dashboard/**',
        '/auth',
        '/auth/**',
        '/en/auth/**',
        '/en/dashboard/**',
        '/fa/auth/**',
        '/fa/dashboard/**',
      ],
      // ✅ Don't fail on errors
      failOnError: false,
    },
    compressPublicAssets: true,
  },

  sitemap: {
    exclude: ['/dashboard/**', '/auth/**', '/**/dashboard/**', '/**/auth/**'],
    sitemapsPathPrefix: '/sitemap',
  },

  components: {
    dirs: ['~/components', { path: '~/components', pathPrefix: false, prefix: 'Lazy' }],
  },

  css: ['~/assets/css/main.css', '~/assets/css/fontiran.css'],

  plugins: [
    '~/plugins/third-party-scripts.client.ts',
    '~/plugins/auth-init.client.ts',
    '~/plugins/chartjs.ts',
  ],

  image: {
    inject: true,
    format: ['webp', 'avif'], // ✅ Add AVIF for better compression
    quality: 80,
    // ✅ Add image optimization
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 50,
          height: 50,
        },
      },
    },
  },

  googleSignIn: {
    clientId:
      process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '61845483496-0uvclftofdph2rtbaq86o0aptoflsdom.apps.googleusercontent.com',
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  vite: {
    plugins: [tailwindcss(), ViteRemoveConsole(), svgLoader({})],
    build: {
      minify: 'esbuild', // minify خود Vite
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor'
          },
        },
      },
    },
  },

  i18n: {
    langDir: 'locales',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'fa',
        language: 'fa-IR',
        name: 'پارسی',
        file: 'fa.ts',
        dir: 'rtl',
        icon: '/images/iran-flag.svg',
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.ts',
        dir: 'ltr',
        icon: '/images/usa-flag.svg',
      },
    ],
    defaultLocale: 'fa',
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: 'i18n_redirected',
    //   redirectOn: 'root', // Only redirect on root path
    //   alwaysRedirect: false,
    // },
    baseUrl: 'https://tetherkade.com',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      // ... keep your manifest config
    },
    workbox: {
      swDest: 'tetherkade-sw.js',
      // ✅ Remove navigateFallback to avoid issues
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp}'],
      // ✅ Add runtime caching
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.tetherkade\.com\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 300, // 5 minutes
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400, // 24 hours
            },
          },
        },
      ],
    },
  },

  experimental: {
    payloadExtraction: false, // Faster for SPA-like apps
    renderJsonPayloads: true,
    viewTransition: true, // Smooth page transitions
  },

  build: {
    transpile: ['chart.js'],
  },

  runtimeConfig: {
    authOrigin: 'https://api.tetherkade.com/api/v1/user',
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.tetherkade.com',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
      cssnano: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    },
  },

  devServer: {
    port: 8001,
  },
})
