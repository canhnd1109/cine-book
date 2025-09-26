import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { FetchError } from 'ofetch'
import Cookies from 'js-cookie'

const API_REQUEST_TIMEOUT = 20000
const defaultHeaders: Record<string, string> = {
  'App-Code': 'cine-book',
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

interface ExtendedFetchOptions<T extends NitroFetchRequest = NitroFetchRequest> extends NitroFetchOptions<T> {
  _retry?: boolean
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const toast = useToast()

  const $http = $fetch.create({
    baseURL: runtimeConfig.public.baseApiUrl,
    headers: defaultHeaders,
    timeout: API_REQUEST_TIMEOUT
    // credentials: 'include'
  })

  async function apiFetch<T>(url: NitroFetchRequest, options: ExtendedFetchOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) ?? {})
    }

    const token = Cookies.get('access-token')
    const language = Cookies.get('i18n_redirected')

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
          const refreshToken = Cookies.get('refresh-token')
          if (!refreshToken) throw new Error('No refresh token')

          const response = await $fetch<any>(`${runtimeConfig.public.baseApiUrl}/refresh`, {
            method: 'POST',
            body: { refreshToken },
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          })

          Cookies.set('access-token', response.accessToken, { secure: true, sameSite: 'strict' })
          Cookies.set('refresh-token', response.refreshToken, { secure: true, sameSite: 'strict' })

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
          Cookies.remove('access-token')
          Cookies.remove('refresh-token')
          throw refreshError
        }
      }
      if (err?.response?.status === 400 && import.meta.client) {
        toast.add({
          title: language === 'en' ? 'Error' : 'Lỗi',
          description: err?.response?._data?.message || 'Có lỗi xảy ra',
          color: 'error'
        })
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
