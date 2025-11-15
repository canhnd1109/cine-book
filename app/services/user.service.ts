import type { IResponseMessage } from '~/types/response.type'
import BaseService from './base.service'
import type { IFormChangePassword, IFormUpdateProfile } from '~/schemas/auth.schema'

export class UserService extends BaseService {
  constructor() {
    super('user')
  }
  async updateProfile(body: IFormUpdateProfile): Promise<IResponseMessage> {
    return this.put<IResponseMessage>('/profile', body)
  }

  async changePassword(body: IFormChangePassword): Promise<IResponseMessage> {
    return this.put<IResponseMessage>('/change-password', body)
  }
}
