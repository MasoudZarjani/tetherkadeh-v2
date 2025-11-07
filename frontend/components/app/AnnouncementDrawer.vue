<template>
  <div>
    <!-- پس زمینه تار -->
    <div
      v-show="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="closeDrawer"
    ></div>

    <!-- Drawer -->
    <div
      class="fixed top-0 left-0 h-full w-full md:w-80 bg-slate-50 dark:bg-slate-800 shadow-lg z-50 transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-lg font-bold">{{ $t('announcements') }}</h2>
        <button @click="closeDrawer" class="text-xl cursor-pointer">&times;</button>
      </div>
      <div class="p-4 space-y-4">
        <div
          v-for="(item, index) in notifications"
          :key="index"
          class="p-4 rounded-lg border"
          :class="statusColors[item.importance as NotificationType]"
        >
          <h3 class="font-bold text-lg mb-1">{{ item.title }}</h3>
          <div>
            <p
              :class="{
                'line-clamp-2': !expanded[index],
              }"
              class="text-sm mb-1"
            >
              {{ item.body }}
            </p>
            <div class="flex justify-between items-center">
              <button
                @click="toggleExpand(index)"
                class="text-gray-500 flex items-center gap-1 text-xs"
              >
                <span>{{ expanded[index] ? $t('close') : $t('more') }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform duration-300"
                  :class="{ 'rotate-180': expanded[index] }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <p class="text-xs text-gray-500 mb-2">
                {{ useJalaliDate(item.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnnouncementStore } from '~/stores/announcement'

const announcement = useAnnouncementStore()
defineProps({
  isOpen: { type: Boolean, default: false },
})
const emits = defineEmits(['close'])

// نوع‌های مجاز اطلاعیه
type NotificationType = 'Error' | 'Info' | 'Success' | 'Warning'

// رنگ‌بندی بر اساس نوع
const statusColors: Record<NotificationType, string> = {
  Error: 'alert-error',
  Info: 'alert-info',
  Success: 'alert-success',
  Warning: 'alert-warning',
}

// لیست اطلاعیه‌ها (مثال)
const notifications: Array<{
  title: string
  body: string
  createdAt: string
  importance: NotificationType
}> = announcement.getAnnouncement() || []

// وضعیت باز/بسته بودن متن هر اطلاعیه
const expanded = ref(Array(notifications.length).fill(false))

function toggleExpand(index: number) {
  expanded.value[index] = !expanded.value[index]
}

function closeDrawer() {
  emits('close')
}
</script>

<style scoped>
/* نیاز به نصب پلاگین line-clamp در Tailwind */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
