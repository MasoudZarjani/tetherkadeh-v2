type LogoutFn = () => void;

export default class ApiService {
  private baseUrl: string;
  private token: string | null;
  private notify?: any;
  private logoutAndRedirect?: LogoutFn;

  constructor(
    baseUrl: string,
    token: string | null = null,
    notify?: any,
    logoutAndRedirect?: LogoutFn
  ) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.notify = notify;
    this.logoutAndRedirect = logoutAndRedirect;
  }

  async get<T>(url: string, options: any = {}): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: "GET",
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(url: string, options: any = {}): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: "DELETE",
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(url: string, body: any, options: any = {}): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: "POST",
        body,
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch<T>(url: string, body: any, options: any = {}): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: "PATCH",
        body,
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(url: string, body: any, options: any = {}): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: "PUT",
        body,
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private getHeaders(customHeaders = {}) {
    return {
      "Content-Type": "application/json",
      "Accept-Language": "fa",
      ...(this.token ? { Authorization: this.token } : {}),
      ...customHeaders,
    };
  }

  private handleError(error: any) {
    const statusCode = error?.status || error?.response?.status;
    if (statusCode === 401 && this.logoutAndRedirect) {
      this.logoutAndRedirect();
      return;
    }

    if (this.notify) {

      console.log("API Error:");
      this.notify({
        text:
          error?.data?.message ||
          error?.data?.messages[0] ||
          "خطا در ارتباط با سرور",
        color: "error",
      });
    }
  }
}
