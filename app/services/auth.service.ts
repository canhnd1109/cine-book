import type { IFormSignUp } from '~/schemas/auth.schema';
import BaseService from '~/services/base.service';
import type { LoginResponse } from '~/types/auth.types'

export class AuthService extends BaseService {
  constructor() {
    super('')
  }
  async register(payload:IFormSignUp): Promise<LoginResponse> {
    return this.post<LoginResponse, typeof payload>('/register', payload)
  }
  async login(payload: { email: string; password: string }): Promise<LoginResponse> {
    return this.post<LoginResponse, typeof payload>('/login', payload)
  }

  async logout(): Promise<void> {
    await this.post<unknown>('/logout')
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.post<LoginResponse, { refreshToken: string }>('/refresh-token', { refreshToken })
  }

  async getUserInfo(): Promise<LoginResponse['user']> {
    return this.get<LoginResponse['user']>('/me')
  }
}


