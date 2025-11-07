import { defineStore } from 'pinia'

interface AlertPayload {
  text: string
  color?: 'error' | 'success' | 'warning' | 'info' | string
  timeout?: number
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    queue: [] as AlertPayload[],
    active: null as AlertPayload | null,
    timer: null as ReturnType<typeof setTimeout> | null,
  }),

  actions: {
    showAlert(payload: AlertPayload) {
      // اضافه کردن به صف
      this.queue.push({
        color: payload.color || 'error',
        timeout: payload.timeout || 4000,
        text: payload.text,
      })

      // اگر هیچ alert فعالی نیست، یکی رو نمایش بده
      if (!this.active) this.nextAlert()
    },

    nextAlert() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      // اگه صف خالیه، تموم شده
      if (this.queue.length === 0) {
        this.active = null
        return
      }

      // یکی از صف رو بردار و فعال کن
      const next = this.queue.shift()!
      this.active = next

      // تایمر برای حذف بعد از timeout
      this.timer = setTimeout(() => {
        this.active = null
        this.nextAlert()
      }, next.timeout)
    },

    // برای بستن دستی
    closeAlert() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.active = null
      this.nextAlert()
    },

    // شورت‌کات ساده
    notify(color: 'error' | 'success' | 'info' | 'warning', text: string, timeout = 4000) {
      this.showAlert({ color, text, timeout })
    },

    clearAll() {
      this.queue = []
      this.active = null
      if (this.timer) clearTimeout(this.timer)
      this.timer = null
    },
  },
})
