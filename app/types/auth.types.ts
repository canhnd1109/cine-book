
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface IUser {
  email:string
}
