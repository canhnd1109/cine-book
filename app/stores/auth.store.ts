import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import type { IResponseLogin, IUser } from '~/types/auth.types'
import { apiAuth } from '~/services'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string>(Cookies.get('access-token') || '')
  const userInfo = ref<IUser | null>(null)
  const isLoading = ref(false)
  const isAuthenticated = computed(() => !!accessToken.value)

  const verifyOtp = async (otp: string, tokenOtp: string) => {
    const { value } = await apiAuth.verifyOtp(otp, tokenOtp)
    setTokens(value)
  }

  function setTokens(response: IResponseLogin) {
    accessToken.value = response.tokenContent
    if (import.meta.client) {
      setCookie('access-token', response.tokenContent, 3)
      setCookie('refresh-token', response.refreshToken, 7)
    }
  }

  const getUserInfo = async () => {
    if (userInfo.value) return userInfo.value
    const { value } = await apiAuth.getUserInfo()
    if (value) {
      userInfo.value = value
    }

    return userInfo.value
  }

  function logOut(options: { redirect?: string } = {}) {
    userInfo.value = null

    if (import.meta.client) {
      clearCookie('access-token')
      clearCookie('refresh-token')
    }

    if (options.redirect) {
      navigateTo(options.redirect)
    }
  }

  return { isAuthenticated, isLoading, setTokens, logOut, getUserInfo, userInfo, verifyOtp }
})
