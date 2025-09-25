import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { FetchError } from 'ofetch'
import type { LoginResponse } from '~/types/auth.types'
import Cookies from 'js-cookie'

const API_REQUEST_TIMEOUT = 20000
const defaultHeaders: Record<string, string> = {
  'App-Code': 'cine-book',
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

interface ExtendedFetchOptions<T extends NitroFetchRequest = NitroFetchRequest>
  extends NitroFetchOptions<T> {
  _retry?: boolean
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const $http = $fetch.create({
    baseURL: runtimeConfig.public.baseApiUrl,
    headers: defaultHeaders,
    timeout: API_REQUEST_TIMEOUT,
    // credentials: 'include'
  })

  async function apiFetch<T>(
    url: NitroFetchRequest,
    options: ExtendedFetchOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> ?? {})
    }

    const token = Cookies.get('access_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.client) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken
    }

    try {
      return await $http<T>(url, { ...options, headers })
    } catch (error) {
      const err = error as FetchError

      if (err?.response?.status === 401 && !options._retry) {
        options._retry = true

        try {
          const refreshToken = Cookies.get('refresh_token')
          if (!refreshToken) throw new Error('No refresh token')

          const response = await $fetch<LoginResponse>(`${runtimeConfig.public.baseApiUrl}/refresh`, {
            method: 'POST',
            body: { refreshToken },
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })

          Cookies.set('access_token', response.accessToken, { secure: true, sameSite: 'strict' })
          Cookies.set('refresh_token', response.refreshToken, { secure: true, sameSite: 'strict' })

          await refreshNuxtData()

          return await $http<T>(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${response.accessToken}`
            }
          })
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          Cookies.remove('access_token')
          Cookies.remove('refresh_token')
          throw refreshError
        }
      }

      throw err
    }
  }

  return {
    provide: {
      http: apiFetch,
      api: apiFetch
    }
  }
})
