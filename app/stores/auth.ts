import { useAuthApi } from '~/services'
import type { LoginResponse } from '~/types/auth.types'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatar?: string
  role?: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Global auth state
const authState = reactive<AuthState>({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false
})

export const useAuthStore = () => {
  // Initialize auth state from localStorage on client side
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

  const logIn = async (data: {
    accessToken: string
    refreshToken: string
    user?: User
  }, redirect = true) => {
    authState.isLoading = true

    try {
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

      // Refresh Nuxt data to update any cached user-dependent data
      await refreshNuxtData()

      // Redirect if specified
      if (redirect) {
        const route = useRoute()
        const redirectTo = route.query.redirect as string || '/'
        await navigateTo(redirectTo)
      }
    } finally {
      authState.isLoading = false
    }
  }

  const logOut = async (options?: { redirect?: string }) => {
    authState.isLoading = true

    try {
      // Call logout API if user is authenticated
      if (authState.isAuthenticated) {
        try {
          const { logout } = useAuthApi()
          await logout()
        } catch (error) {
          // Ignore logout API errors
          console.warn('Logout API call failed:', error)
        }
      }

      // Clear state
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

      // Clear Nuxt data cache
      await clearNuxtData()

      // Redirect if specified
      if (options?.redirect) {
        await navigateTo(options.redirect)
      }
    } finally {
      authState.isLoading = false
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      authState.user = { ...authState.user, ...userData }

      // Update localStorage
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(authState.user))
      }
    }
  }

  const refreshTokens = async () => {
    if (!authState.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const { refreshToken } = useAuthApi()
      const response = await refreshToken(authState.refreshToken)

      authState.accessToken = (response.data as LoginResponse).accessToken
      authState.refreshToken = (response.data as LoginResponse).refreshToken

      // Update localStorage
      if (import.meta.client) {
        localStorage.setItem('accessToken', (response.data as LoginResponse).accessToken)
        localStorage.setItem('refreshToken', (response.data as LoginResponse).refreshToken)
      }

      return response.data
    } catch (error) {
      // If refresh fails, logout user
      await logOut()
      throw error
    }
  }

  // Check if user has specific role
  const hasRole = (role: string) => {
    return authState.user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]) => {
    return authState.user?.role ? roles.includes(authState.user.role) : false
  }

  // Get user's full name
  const getFullName = () => {
    if (!authState.user) return ''
    const { firstName, lastName } = authState.user
    return `${firstName || ''} ${lastName || ''}`.trim()
  }

  // Get user's initials
  const getInitials = () => {
    if (!authState.user) return ''
    const { firstName, lastName } = authState.user
    const firstInitial = firstName?.charAt(0).toUpperCase() || ''
    const lastInitial = lastName?.charAt(0).toUpperCase() || ''
    return `${firstInitial}${lastInitial}`
  }

  return {
    // State (readonly)
    accessToken: readonly(toRef(authState, 'accessToken')),
    refreshToken: readonly(toRef(authState, 'refreshToken')),
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),

    // Computed
    isLoggedIn: computed(() => authState.isAuthenticated && !!authState.accessToken),
    userRole: computed(() => authState.user?.role),
    userFullName: computed(() => getFullName()),
    userInitials: computed(() => getInitials()),

    // Actions
    initializeAuth,
    logIn,
    logOut,
    updateUser,
    refreshTokens,
    hasRole,
    hasAnyRole,
    getFullName,
    getInitials
  }
}

// Auto-initialize auth on client side
if (import.meta.client) {
  const authStore = useAuthStore()
  authStore.initializeAuth()
}
