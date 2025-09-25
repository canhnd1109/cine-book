interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

const authState = reactive<AuthState>({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false
})

export const useAuthStore = () => {
  const logIn = (data: { accessToken: string; refreshToken: string; user?: User }, _redirect = true) => {
    authState.accessToken = data.accessToken
    authState.refreshToken = data.refreshToken
    authState.user = data.user || null
    authState.isAuthenticated = true

    // Store tokens in localStorage for persistence
    if (import.meta.client) {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    }
  }

  const logOut = (options?: { redirect?: string }) => {
    authState.accessToken = null
    authState.refreshToken = null
    authState.user = null
    authState.isAuthenticated = false

    // Clear localStorage
    if (import.meta.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }

    // Redirect if specified
    if (options?.redirect) {
      navigateTo(options.redirect)
    }
  }

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    if (import.meta.client) {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const userStr = localStorage.getItem('user')

      if (accessToken && refreshToken) {
        authState.accessToken = accessToken
        authState.refreshToken = refreshToken
        authState.isAuthenticated = true

        if (userStr) {
          try {
            authState.user = JSON.parse(userStr)
          } catch {
            authState.user = null
          }
        }
      }
    }
  }

  return {
    // State
    accessToken: readonly(toRef(authState, 'accessToken')),
    refreshToken: readonly(toRef(authState, 'refreshToken')),
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoggedIn: computed(() => authState.isAuthenticated && !!authState.accessToken),

    // Actions
    logIn,
    logOut,
    initializeAuth
  }
}
