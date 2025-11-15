import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { IFormUpdateProfile } from '~/schemas/auth.schema'

export class UserService extends BaseService {
  constructor() {
    super('user')
  }
  async updateProfile(body: IFormUpdateProfile): Promise<IResponseMessage> {
    return this.put<IResponseMessage>('/profile', body)
  }

  async changePassword(body: { currentPassword: string; newPassword: string }): Promise<IResponseMessage> {
    return this.put<IResponseMessage>('/change-password', body)
  }
}
