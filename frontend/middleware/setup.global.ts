import { useSettingStore } from '~/stores/setting'
import { useAnnouncementStore } from '~/stores/announcement'

export default defineNuxtRouteMiddleware(async () => {
  const config = useRuntimeConfig()
  const setting = useSettingStore()
  const announcement = useAnnouncementStore()

  if (!announcement.getAnnouncement() || announcement.getAnnouncement().length === 0) {
    const response = await fetch(`${config.public.baseURL}/api/v1/announcements`)
    const data = await response.json()
    announcement.setAnnouncement(data.data)
  }

  await setting.ensureSettingLoaded(config.public.baseURL)
})
