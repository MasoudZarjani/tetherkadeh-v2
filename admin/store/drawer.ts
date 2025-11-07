import { defineStore } from "pinia";

export const useDrawerStore = defineStore("drawer", {
  state: () => ({
    drawer: true,
    rail: false,
  }),

  actions: {
    async toggleSidebar() {
      this.rail = !this.rail;
      this.drawer = !this.drawer;
    },
  },
});
