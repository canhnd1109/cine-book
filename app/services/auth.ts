import { useNuxtApp } from "#app"
import createBaseService from "~/plugins/base"

type QueryParams = Record<string, string | number | boolean | string[] | number[] | undefined>

export function useAuthApi() {
  const nuxtApp = useNuxtApp()
  const { $http } = nuxtApp
  const authService = createBaseService("/auth", $http)

  const login = async (
    credentials: { email: string; password: string },
    params?: QueryParams
  ) => {
    return authService.postWithResponse("/login", credentials, { params })
  }

  const register = async (
    userData: {
      firstName: string
      lastName: string
      email: string
      phoneNumber: string
      password: string
    },
    params?: QueryParams
  ) => {
    return authService.postWithResponse("/register", userData, { params })
  }

  const logout = async (params?: QueryParams) => {
    return authService.post("/logout", undefined, { params })
  }

  const refreshToken = async (
    refreshToken: string,
    params?: QueryParams
  ) => {
    return authService.postWithResponse("/refresh", { refreshToken }, { params })
  }

  const forgotPassword = async (
    email: string,
    params?: QueryParams
  ) => {
    return authService.postWithResponse("/forgot-password", { email }, { params })
  }

  const resetPassword = async (
    data: { token: string; password: string },
    params?: QueryParams
  ) => {
    return authService.postWithResponse("/reset-password", data, { params })
  }

  return {
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
  }
}
