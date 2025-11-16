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
  const roleName = ref<'ROLE_ADMIN' | 'ROLE_USER'>('ROLE_USER')
  const isAdmin = computed(() => userInfo.value?.role === 'ROLE_ADMIN')
  const isOpenModalSignIn = ref(false)

  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value
  })

  const verifyOtp = async (otp: string, tokenOtp: string) => {
    const { value } = await apiAuth.verifyOtp(otp, tokenOtp)
    setTokens(value)

    // Wait for cookies to be set properly
    await new Promise(resolve => setTimeout(resolve, 100))

    await getUserInfo()
  }

  function setTokens(response: IResponseLogin) {
    accessTokenCookie.value = response.tokenContent
    refreshTokenCookie.value = response.refreshToken
  }

  const getUserInfo = async () => {
    try {
      if (userInfo.value) return userInfo.value
      const { value } = await apiAuth.getUserInfo()
      if (value) {
        roleName.value = value.role
        userInfo.value = value
      }
    } catch (error) {
      console.log(error)
    }
  }

  function logOut(options: { redirect?: string } = {}) {
    accessTokenCookie.value = null
    refreshTokenCookie.value = null

    if (options.redirect) {
      navigateTo(options.redirect)
    }
  }

  return {
    isAuthenticated,
    userInfo,
    isOpenModalSignIn,
    setTokens,
    logOut,
    verifyOtp,
    getUserInfo,
    isAdmin
  }
})
