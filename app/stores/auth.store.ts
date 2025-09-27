import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import type { IResponseLogin, IUser } from '~/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<IUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  function setTokens(response: IResponseLogin) {
    accessToken.value = response.tokenContent
    refreshToken.value = response.refreshToken
    isAuthenticated.value = true

    if (import.meta.client) {
      Cookies.set('access-token', response.tokenContent, { expires: 1 })
      Cookies.set('refresh-token', response.refreshToken, { expires: 7 })
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
    logOut,
    restoreAuth
  }
})
