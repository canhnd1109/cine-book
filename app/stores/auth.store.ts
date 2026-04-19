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
  const fetchedForToken = ref<string | null>(null)
  const roleName = ref<'ROLE_ADMIN' | 'ROLE_USER'>('ROLE_USER')
  const isAdmin = computed(() => userInfo.value?.role === 'ROLE_ADMIN')
  const isOpenModalSignIn = ref(false)

  const isAuthenticated = computed(() => {
    return !!accessTokenCookie.value
  })

  const verifyOtp = async (otp: string, tokenOtp: string) => {
    const { value } = await apiAuth.verifyOtp(otp, tokenOtp)
    setTokens(value)

    await getUserInfo(true)
  }

  function setTokens(response: IResponseLogin) {
    if (accessTokenCookie.value !== response.tokenContent) {
      userInfo.value = null
      fetchedForToken.value = null
      roleName.value = 'ROLE_USER'
    }

    accessTokenCookie.value = response.tokenContent
    refreshTokenCookie.value = response.refreshToken
  }

  const getUserInfo = async (force = false) => {
    try {
      if (!accessTokenCookie.value) {
        userInfo.value = null
        fetchedForToken.value = null
        roleName.value = 'ROLE_USER'
        return null
      }

      if (!force && userInfo.value && fetchedForToken.value === accessTokenCookie.value) {
        return userInfo.value
      }

      const { value } = await apiAuth.getUserInfo()
      if (value) {
        roleName.value = value.role
        userInfo.value = value
        fetchedForToken.value = accessTokenCookie.value
      }

      return value
    } catch (error) {
      console.log(error)
      return null
    }
  }

  function logOut() {
    userInfo.value = null
    fetchedForToken.value = null
    roleName.value = 'ROLE_USER'
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    navigateTo('/')
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
