import { defineStore } from "pinia";

export const useOverlayStore = defineStore("overlay", {
  state: () => ({
    status: false,
  }),

  actions: {
    async toggleOverlay(isShow: boolean) {
      this.status = isShow;
    },
  },
});
