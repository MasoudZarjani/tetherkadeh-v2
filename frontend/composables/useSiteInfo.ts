import { useSettingStore } from '~/stores/setting'

export async function useSiteInfo() {
  const setting = useSettingStore()
  const config = useRuntimeConfig()
  // اگر در state هنوز نیست، از cache یا API لود می‌کنیم
  if (!setting.data) {
    await setting.ensureSettingLoaded(config.public.baseURL)
  }

  // داده به‌صورت reactive (برای vue template)
  const site = computed(() => setting.data)

  return {
    site,
    refresh: async () => {
      // پاک کردن cache و fetch مجدد
      setting.clearCache()
      await setting.ensureSettingLoaded(config.public.baseURL)
    },
  }
}
