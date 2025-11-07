import { defineStore } from "pinia";
import type { Setting } from "~/types/setting.types";

export const useSettingStore = defineStore("data", {
  state: () => ({ data: null as Setting | null }),
  actions: {
    setSetting(newData: any) {
      this.data = newData;
    },
    getSetting() {
      return this.data;
    },
  },
});
