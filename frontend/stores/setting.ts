import { defineStore } from 'pinia'
import type { Setting } from '~/types/setting.types'

const CACHE_KEY = 'site-settings'
const CACHE_TTL = 60 * 60 * 1000 // 1 ساعت

// Cache در سطح سرور (بین رندرها)
const globalCache: {
  data?: Setting
  timestamp?: number
} = {}

export const useSettingStore = defineStore('setting', {
  state: () => ({
    data: null as Setting | null,
  }),

  actions: {
    /**
     * ذخیره داده در state، cache مرورگر و حافظه سرور
     */
    setSetting(newData: Setting) {
      this.data = newData

      // سمت کلاینت: ذخیره در localStorage
      if (import.meta.client) {
        const cached = {
          data: newData,
          timestamp: Date.now(),
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
      }

      // سمت سرور: ذخیره در حافظه سراسری
      if (import.meta.server) {
        globalCache.data = newData
        globalCache.timestamp = Date.now()
      }
    },

    /**
     * تلاش برای بارگذاری داده از cache کلاینت
     */
    loadFromClientCache() {
      if (!import.meta.client) return

      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (!cached) return

        const { data, timestamp } = JSON.parse(cached)
        const isExpired = Date.now() - timestamp > CACHE_TTL

        if (isExpired) {
          localStorage.removeItem(CACHE_KEY)
          return
        }

        this.data = data
      } catch (error) {
        console.warn('⚠️ خطا در خواندن cache:', error)
      }
    },

    /**
     * تلاش برای بارگذاری داده از cache سرور
     */
    loadFromServerCache() {
      if (!import.meta.server) return

      if (
        globalCache.data &&
        globalCache.timestamp &&
        Date.now() - globalCache.timestamp < CACHE_TTL
      ) {
        this.data = globalCache.data
      }
    },

    /**
     * گرفتن داده (از state، cache یا fetch از API)
     */
    async ensureSettingLoaded(baseURL: string) {
      // اگر در state موجود است، نیازی به fetch نیست
      if (this.data) return this.data

      // SSR: تلاش از حافظه‌ی سرور
      this.loadFromServerCache()

      // Client: تلاش از localStorage
      if (import.meta.client && !this.data) {
        this.loadFromClientCache()
      }
      // اگر هنوز داده نداریم → fetch از API
      if (!this.data) {
        try {
          const response = await fetch(`${baseURL}/api/v1/setting/site-info`)
          const result = await response.json()
          this.setSetting(result.data)
        } catch (error) {
          console.error('❌ خطا در دریافت تنظیمات سایت:', error)
        }
      }

      return this.data
    },

    clearCache() {
      this.data = null
      if (import.meta.client) {
        localStorage.removeItem(CACHE_KEY)
      }
      if (import.meta.server) {
        globalCache.data = undefined
        globalCache.timestamp = undefined
      }
    },
  },
})
