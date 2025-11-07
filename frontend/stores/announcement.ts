import { defineStore } from "pinia";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({ announcement: [] as any }),
  actions: {
    setAnnouncement(newData: any) {
      this.announcement = newData;
    },
    getAnnouncement() {
      return this.announcement;
    },
  },
});
