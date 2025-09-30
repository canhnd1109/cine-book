import { defineStore } from 'pinia'
import type { IResponseLogin, IUser } from '~/types/auth.types'
import { apiAuth } from '~/services'

export const useAuthStore = defineStore('auth', () => {
  const accessTokenCookie = useCookie('access-token', {
    maxAge: 60 * 60 * 24 * 3,
    sameSite: 'lax'
  })

  const refreshTokenCookie = useCookie('refresh-token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const userInfo = ref<IUser | null>(null)

  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value
  })

  const verifyOtp = async (otp: string, tokenOtp: string) => {
    const { value } = await apiAuth.verifyOtp(otp, tokenOtp)
    setTokens(value)
    await getUserInfo()
  }

  function setTokens(response: IResponseLogin) {
    accessTokenCookie.value = response.tokenContent
    refreshTokenCookie.value = response.refreshToken
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
    if (import.meta.client) {
      clearCookie('access-token')
      clearCookie('refresh-token')
    }

    if (options.redirect) {
      navigateTo(options.redirect)
    }
  }

  return {
    isAuthenticated,
    userInfo,
    setTokens,
    logOut,
    verifyOtp,
    getUserInfo
  }
})
