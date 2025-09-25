import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { LoginResponse } from '~/types/auth.types'
import { useAuthStore } from '~/stores/auth'

const API_REQUEST_TIMEOUT = 20000 // 20s
const headers = {
  'App-Code': 'cine-book',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

export default defineNuxtPlugin(() => {
  try {

    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()


    // Create axios instance
    const $http: AxiosInstance = axios.create({
      baseURL: `${runtimeConfig.public.baseApiUrl}`,
      headers,
      timeout: API_REQUEST_TIMEOUT,
      withCredentials: true, // Enable cookies for CSRF protection
    })


    // Request interceptor to add token to header
    $http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = authStore.accessToken.value
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add CSRF token if available
        if (import.meta.client) {
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          if (csrfToken && config.headers) {
            config.headers['X-CSRF-Token'] = csrfToken
          }
        }

        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )


    // Response interceptor to handle 401 errors and token refresh
    $http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (!originalRequest.url?.includes('/auth')) {
            originalRequest._retry = true

            try {
              const config = useRuntimeConfig()
              const response = await axios.post<LoginResponse>(
                `${config.public.baseApiUrl}/api/v1/auth/refresh`,
                { refreshToken: authStore.refreshToken.value },
                {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials: true
                }
              )

              authStore.logIn(response.data, false)
              await refreshNuxtData()

              // Retry original request with new token
              const token = authStore.accessToken.value
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return $http(originalRequest)
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError)
              authStore.logOut()
              return Promise.reject(new Error('Token refresh failed'))
            }
          } else {
            console.error('Auth error:', error.response?.data)
            authStore.logOut({ redirect: (useRoute().query.redirect as string) || '/' })
          }
        }

        // Handle other common errors
        if (error.response?.status === 403) {
          console.error('Forbidden:', error.response?.data)
          authStore.logOut({ redirect: '/login' })
        }

        if (error.response?.status >= 500) {
          console.error('Server error:', error.response?.data)
        }

        return Promise.reject(error)
      }
    )


    return {
      provide: {
        http: $http,
        api: $http // Alias for easier access
      }
    }
  } catch (error) {
    console.error('Error initializing HTTP plugin:', error)
    throw error
  }
})
