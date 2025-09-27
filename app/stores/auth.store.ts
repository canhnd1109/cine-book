import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import type { IResponseLogin, IUser } from '~/types/auth.types'
import { apiAuth } from '~/services'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const userInfo = ref<IUser | null>(null)
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

  const getUserInfo = () => {
    if (userInfo.value) return userInfo.value

    const { data, status } = useAsyncData('user-info', () => apiAuth.getUserInfo(), {
      server: true,
      lazy: true,
      default: () => null
    })
    if (data.value && status.value === 'success') {
      userInfo.value = data.value.value
    }
  }

  function logOut(options: { redirect?: string } = {}) {
    accessToken.value = null
    refreshToken.value = null
    userInfo.value = null
    isAuthenticated.value = false

    if (import.meta.client) {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    }

    if (options.redirect) {
      navigateTo(options.redirect)
    }
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    setTokens,
    logOut,
    getUserInfo,
    userInfo
  }
})
