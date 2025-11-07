import ApiService from "@/utils/ApiService";
import { useAlertStore } from "~/store/alert";

export const useApi = () => {
  const config = useRuntimeConfig();
  const notifyStore = useAlertStore();
  const { token, signOut } = useAuth();

  const logoutAndRedirect = () => {
    signOut({ callbackUrl: "/login" });
  };

  const tokenString = token.value;
  const apiUrl = import.meta.server
    ? config.API_INTERNAL_URL
    : config.public.baseURL;

  return new ApiService(
    apiUrl as string,
    tokenString,
    notifyStore.showAlert,
    logoutAndRedirect
  );
};
