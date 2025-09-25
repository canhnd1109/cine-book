export interface IResponseMessage {
  code: number
  message: string
  status: string
}

export interface IResponseData<T> {
  code: number
  message: string
  value: T
}
