import BaseService from '~/plugins/base'

export function useAuthApi() {
  const authService = new BaseService('/auth')

  const login = async (credentials: { email: string; password: string }) => {
    return authService.postWithResponse('/login', credentials)
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    password: string
  }) => {
    return authService.postWithResponse('/register', userData)
  }

  const logout = async () => {
    return authService.post('/logout')
  }

  const refreshToken = async (refreshToken: string) => {
    return authService.postWithResponse('/refresh', { refreshToken })
  }

  const forgotPassword = async (email: string) => {
    return authService.postWithResponse('/forgot-password', { email })
  }

  const resetPassword = async (data: { token: string; password: string }) => {
    return authService.postWithResponse('/reset-password', data)
  }

  return {
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
  }
}
