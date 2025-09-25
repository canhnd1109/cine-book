import BaseService from '~/plugins/base'

export function useUserApi() {
  const userService = new BaseService('/users')

  const getProfile = async () => {
    return userService.get('/profile')
  }

  const updateProfile = async (data: Record<string, unknown>) => {
    return userService.put('/profile', data)
  }

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    return userService.put('/change-password', data)
  }

  const uploadAvatar = async (file: File) => {
    return userService.upload('/avatar', file)
  }

  return {
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar
  }
}
