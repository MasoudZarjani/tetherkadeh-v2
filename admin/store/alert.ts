import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    status: false,
    text: "",
    color: "error",
  }),

  actions: {
    async disableAlert() {
      this.status = false;
    },

    async showAlert(value: any) {
      this.status = true;
      this.text = value.text;
      this.color = value.color;
    },
  },
});
