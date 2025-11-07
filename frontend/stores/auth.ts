import { defineStore } from 'pinia'
import type { User } from '~/types/user.types'

interface LoginCredentials {
  user: string
  password: string
  code?: string | null
}

interface ApiResponse<T> {
  data: T
}

const TOKEN_KEY = 'auth_token'
const TOKEN_ISSUED_KEY = 'auth_token_issued'
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    tokenIssuedAt: null as number | null,
    isAuthenticated: false,
    isReady: false,
    isLoading: false,
  }),

  getters: {
    isTokenExpired: state => {
      if (!state.tokenIssuedAt) return true
      return Date.now() - state.tokenIssuedAt > TOKEN_EXPIRY_MS
    },
  },

  actions: {
    /**
     * Initialize auth state from storage (client-side only)
     */
    async initialize() {
      // Prevent running on server
      if (import.meta.server) {
        this.isReady = true
        return
      }

      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const issued = localStorage.getItem(TOKEN_ISSUED_KEY)

        if (!token) {
          this.isReady = true
          return
        }

        this.token = token
        this.tokenIssuedAt = issued ? Number(issued) : null

        // Check if token is expired
        if (this.isTokenExpired) {
          console.log('Token expired during initialization')
          this.logout()
          return
        }

        // Try to fetch profile to validate token
        await this.fetchProfile()
      } catch (error) {
        console.error('Initialize failed:', error)
        this.logout()
      } finally {
        this.isReady = true
      }
    },

    /**
     * Login user with credentials
     */
    async login(credentials: LoginCredentials, options: any) {
      if (this.isLoading) {
        throw new Error('Login already in progress')
      }

      this.isLoading = true

      try {
        const res = await $fetch<ApiResponse<{ token: string }>>(
          'https://api.tetherkade.com/api/v1/user/login',
          {
            method: 'POST',
            body: credentials,
            headers: options,
          }
        )
        const token = res?.data?.token
        if (!token) {
          throw new Error('Token not found in response')
        }
        this.setToken(token)
        await this.fetchProfile()

        return true
      } catch (error) {
        this.logout()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Set authentication token and persist to storage
     */
    setToken(token: string) {
      if (import.meta.server) return

      const issuedAt = Date.now()

      this.token = token
      this.tokenIssuedAt = issuedAt
      this.isAuthenticated = true

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(TOKEN_ISSUED_KEY, issuedAt.toString())
    },

    /**
     * Fetch user profile and update state
     */
    async fetchProfile() {
      if (!this.token && import.meta.client) {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const issued = localStorage.getItem(TOKEN_ISSUED_KEY)

        if (storedToken) {
          this.token = storedToken
          this.tokenIssuedAt = issued ? Number(issued) : null
        } else {
          return
        }
      }

      if (!this.token) return
      // Check token expiry
      if (this.isTokenExpired) {
        console.log('Token expired')
        this.logout()
        return
      }

      this.isLoading = true

      try {
        const res = await $fetch<ApiResponse<User>>(
          'https://api.tetherkade.com/api/v1/user/profile',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )

        this.user = res?.data || (res as any)
        this.isAuthenticated = true
      } catch (error) {
        console.error('Fetch profile failed:', error)
        this.logout()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Get profile data without updating state (utility method)
     */
    async getProfile(): Promise<User> {
      if (!this.token && import.meta.client) {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        if (!storedToken) throw new Error('No token found')
        this.token = storedToken
      }

      if (!this.token) throw new Error('No token available')

      const res = await $fetch<ApiResponse<User>>(
        'https://api.tetherkade.com/api/v1/user/profile',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )

      return res?.data || (res as any)
    },

    /**
     * Logout user and clear all auth data
     */
    logout() {
      this.user = null
      this.token = null
      this.tokenIssuedAt = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(TOKEN_ISSUED_KEY)
      }
    },
  },
})
