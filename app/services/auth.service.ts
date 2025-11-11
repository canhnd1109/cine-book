import type { IFormSignIn, IFormSignUp } from '~/schemas/auth.schema'
import BaseService from '~/services/base.service'
import type { IResponseLogin, IResponseOtpLogin, IUser } from '~/types/auth.types'
import type { IResponseData, IResponseMessage } from '~/types/response.type'

export class AuthService extends BaseService {
  constructor() {
    super('')
  }
  async register(payload: IFormSignUp): Promise<IResponseMessage> {
    return this.post<IResponseMessage>('/register', payload)
  }
  async login(payload: IFormSignIn): Promise<IResponseData<IResponseOtpLogin>> {
    return this.post<IResponseData<IResponseOtpLogin>>('/otp-sign-in', payload)
  }

  async verifyOtp(payload: string, token: string): Promise<IResponseData<IResponseLogin>> {
    return this.post<IResponseData<IResponseLogin>>(`/verify-sign-in/${payload}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  async getUserInfo(): Promise<IResponseData<IUser>> {
    return this.post<IResponseData<IUser>>('/token')
  }

  async logout(): Promise<void> {
    await this.post<unknown>('/logout')
  }

  async refreshToken(refreshToken: string): Promise<IResponseLogin> {
    return this.post<IResponseLogin>('/refresh-token', { refreshToken })
  }
}
