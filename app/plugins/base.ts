import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

// Define more specific types for different use cases
type QueryParams = Record<string, string | number | boolean | string[] | number[] | undefined | unknown>
type RequestBody = Record<string, unknown> | FormData | string
type DeleteParams = Record<string, string | number | boolean | undefined>

// Generic response interface
interface IResponse<T> {
  data: T
  message?: string
  status?: number
}

export default class BaseService {
  prefix: string
  private http: AxiosInstance

  constructor(prefix: string) {
    this.prefix = prefix
    // Get the axios instance from Nuxt plugin
    const { $http } = useNuxtApp()
    this.http = $http
  }

  async get<T>(url: string, params?: QueryParams, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.get(`${this.prefix}${url}`, {
        ...config,
        params: { ...(config?.params ?? {}), ...(params ?? {}) }
      })
      return {
        data: response.data,
        status: response.status,
        message: response.statusText
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async post<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.post(`${this.prefix}${url}`, data, config)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async put<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.put(`${this.prefix}${url}`, data, config)
      return {
        data: response.data,
        status: response.status,
        message: response.statusText
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete<T>(url: string, params?: DeleteParams): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.delete(`${this.prefix}${url}`, { params })
      return {
        data: response.data,
        status: response.status,
        message: response.statusText
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Alternative: More flexible version with generic constraints
  async postGeneric<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<IResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> = await this.http.post(`${this.prefix}${url}`, data, config)
      return {
        data: response.data,
        status: response.status,
        message: response.statusText
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async putGeneric<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<IResponse<TResponse>> {
    try {
      const response: AxiosResponse<TResponse> = await this.http.put(`${this.prefix}${url}`, data, config)
      return {
        data: response.data,
        status: response.status,
        message: response.statusText
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
