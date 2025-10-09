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

export interface IResponsePagination<T> {
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
  sortBy: {
    property: string
    direction: string
  }
  content: T
}
