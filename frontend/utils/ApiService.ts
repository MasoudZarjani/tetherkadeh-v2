type LogoutFn = () => void
type NotifyFn = (options: { text: string; color?: string }) => void
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

export default class ApiService {
  private baseUrl: string
  private token: string | null
  private notify?: NotifyFn
  private logoutAndRedirect?: LogoutFn
  private locale?: string

  constructor(
    baseUrl: string,
    token?: string | null,
    notify?: NotifyFn,
    logoutAndRedirect?: LogoutFn,
    locale?: string
  ) {
    this.baseUrl = baseUrl
    this.token = token ?? null
    this.notify = notify
    this.logoutAndRedirect = logoutAndRedirect
    this.locale = locale
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options)
  }

  async post<T>(url: string, body?: Record<string, any>, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', url, body, options)
  }

  async put<T>(url: string, body?: Record<string, any>, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', url, body, options)
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options)
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: Record<string, any>,
    options?: RequestOptions
  ): Promise<T> {
    try {
      const response: any = await $fetch<T>(this.baseUrl + url, {
        method: method as any,
        body,
        headers: this.getHeaders(options?.headers),
        ...options,
      })
      return response?.data ?? response
    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.locale) {
      headers['Accept-Language'] = this.locale
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return { ...headers, ...customHeaders }
  }

  private handleError(error: any): void {
    const statusCode = error?.statusCode || error?.status || error?.response?.status

    if (statusCode === 401 && this.logoutAndRedirect) {
      this.logoutAndRedirect()
      return
    }

    const message =
      error?.data?.message ||
      error?.data?.messages?.[0] ||
      error?.statusMessage ||
      error?.message ||
      'خطایی در ارتباط با سرور رخ داده است'

    this.notify?.({ text: message, color: 'error' })
  }
}
