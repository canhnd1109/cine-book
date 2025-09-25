import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import type { IUser, LoginResponse } from '~/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<IUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  function setTokens(response: LoginResponse, redirect = true) {
    accessToken.value = response.accessToken
    refreshToken.value = response.refreshToken
    user.value = response.user ?? null
    isAuthenticated.value = true

    if (import.meta.client) {
      Cookies.set('accessToken', response.accessToken, { expires: 1 }) // 1 ngày
      Cookies.set('refreshToken', response.refreshToken, { expires: 7 }) // 7 ngày
      if (response.user) {
        Cookies.set('user', JSON.stringify(response.user), { expires: 1 })
      }
    }

    if (redirect) {
      const route = useRoute()
      const redirectTo = (route.query.redirect as string) || '/'
      navigateTo(redirectTo)
    }
  }

  async function logIn(data: { email: string; password: string }, redirect = true) {
    isLoading.value = true
    try {
      const response = await useNuxtApp().$api<LoginResponse>('/login', {
        method: 'POST',
        body: data
      })
      setTokens(response, redirect)
    } finally {
      isLoading.value = false
    }
  }

  function logOut(options: { redirect?: string } = {}) {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    isAuthenticated.value = false

    if (import.meta.client) {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('user')
    }

    if (options.redirect) {
      navigateTo(options.redirect)
    }
  }

  function restoreAuth() {
    if (import.meta.client) {
      const storedAccessToken = Cookies.get('accessToken') || null
      const storedRefreshToken = Cookies.get('refreshToken') || null
      const storedUser = Cookies.get('user')

      if (storedAccessToken && storedRefreshToken) {
        accessToken.value = storedAccessToken
        refreshToken.value = storedRefreshToken
        user.value = storedUser ? JSON.parse(storedUser) : null
        isAuthenticated.value = true
      }
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isLoading,
    setTokens,
    logIn,
    logOut,
    restoreAuth
  }
})
