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
  success?: boolean
}

interface ApiError {
  message: string
  status?: number
  code?: string
  details?: unknown
}

interface AxiosError {
  response?: {
    status?: number
    data?: unknown
  }
  code?: string
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

  // Generic error handler
  private handleError(error: unknown): ApiError {
    const axiosError = error as AxiosError
    const apiError: ApiError = {
      message: (error as Error).message || 'An error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data
    }

    // Log error in development
    if (import.meta.dev) {
      console.error('API Error:', apiError)
    }

    return apiError
  }

  // GET request with better error handling
  async get<T>(url: string, params?: QueryParams, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.get(`${this.prefix}${url}`, {
        ...config,
        params: { ...(config?.params ?? {}), ...(params ?? {}) }
      })

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // POST request
  async post<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.post(`${this.prefix}${url}`, data, config)
      return response.data
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // POST request with full response
  async postWithResponse<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.post(`${this.prefix}${url}`, data, config)

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // PUT request
  async put<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.put(`${this.prefix}${url}`, data, config)

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // PATCH request
  async patch<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.patch(`${this.prefix}${url}`, data, config)

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // DELETE request
  async delete<T>(url: string, params?: DeleteParams): Promise<IResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.http.delete(`${this.prefix}${url}`, { params })

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // Upload file
  async upload<T>(url: string, file: File, additionalData?: Record<string, unknown>): Promise<IResponse<T>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      const response: AxiosResponse<T> = await this.http.post(`${this.prefix}${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }

  // Generic methods with better typing
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
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
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
        message: response.statusText,
        success: true
      }
    } catch (error) {
      const apiError = this.handleError(error)
      throw apiError
    }
  }
}
