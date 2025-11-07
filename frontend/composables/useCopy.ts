import { useAlertStore } from "~/stores/alert";

export default function (text: any) {
  const { showAlert } = useAlertStore();
  navigator.clipboard.writeText(text);
  showAlert({ text: "کپی شد!", color: "success" });
}
