import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menuOpen: false,
  }),

  actions: {
    async toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
});
