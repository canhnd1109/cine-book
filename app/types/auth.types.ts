export interface IResponseOtpLogin {
  tokenContent: string
  expToken: string
}

export interface IResponseLogin {
  tokenContent: string
  refreshToken: string
  userId: string
  userName: string
  roleName: string
  expToken: string
  expRefreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface IUser {
  email: string
}
