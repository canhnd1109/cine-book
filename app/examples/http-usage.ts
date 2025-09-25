// Example usage of the axios HTTP client
// This file demonstrates how to use the configured axios instance

import BaseService from '~/plugins/base'

// Example API service class
class UserService extends BaseService {
  constructor() {
    super('/users') // API prefix
  }

  // Get user profile
  async getUserProfile(userId: string) {
    return this.get(`/${userId}`)
  }

  // Update user profile
  async updateUserProfile(userId: string, data: any) {
    return this.put(`/${userId}`, data)
  }

  // Create new user
  async createUser(userData: any) {
    return this.post('', userData)
  }

  // Delete user
  async deleteUser(userId: string) {
    return this.delete(`/${userId}`)
  }
}

// Example usage in a component or composable
export const useUserService = () => {
  const userService = new UserService()

  const getUserProfile = async (userId: string) => {
    try {
      const response = await userService.getUserProfile(userId)
      return response.data
    } catch (error) {
      console.error('Failed to get user profile:', error)
      throw error
    }
  }

  const updateUserProfile = async (userId: string, data: any) => {
    try {
      const response = await userService.updateUserProfile(userId, data)
      return response.data
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  }

  return {
    getUserProfile,
    updateUserProfile
  }
}

// Example direct axios usage (if you need more control)
export const useDirectAxios = () => {
  const { $http } = useNuxtApp()

  const customRequest = async () => {
    try {
      const response = await $http.get('/custom-endpoint', {
        params: { page: 1, limit: 10 },
        headers: { 'Custom-Header': 'value' }
      })
      return response.data
    } catch (error) {
      console.error('Custom request failed:', error)
      throw error
    }
  }

  return {
    customRequest
  }
}
