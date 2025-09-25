import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios"

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

// Interface for the service methods
interface BaseServiceInterface {
  prefix: string
  get<T>(url: string, params?: QueryParams, config?: AxiosRequestConfig): Promise<IResponse<T>>
  post<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<T>
  postWithResponse<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>>
  put<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>>
  patch<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>>
  delete<T>(url: string, params?: DeleteParams): Promise<IResponse<T>>
  upload<T>(url: string, file: File, additionalData?: Record<string, unknown>): Promise<IResponse<T>>
  postGeneric<TResponse, TRequest = unknown>(url: string, data?: TRequest, config?: AxiosRequestConfig): Promise<IResponse<TResponse>>
  putGeneric<TResponse, TRequest = unknown>(url: string, data?: TRequest, config?: AxiosRequestConfig): Promise<IResponse<TResponse>>
}

// Factory function to create base service
export function createBaseService(prefix: string, httpInstance: AxiosInstance): BaseServiceInterface {
  // Generic error handler
  const handleError = (error: unknown): ApiError => {
    const axiosError = error as AxiosError
    const apiError: ApiError = {
      message: (error as Error).message || "An error occurred",
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data,
    }

    // Log error in development
    if (import.meta.dev) {
      console.error("API Error:", apiError)
    }

    return apiError
  }

  return {
    prefix,

    // GET request with better error handling
    async get<T>(url: string, params?: QueryParams, config?: AxiosRequestConfig): Promise<IResponse<T>> {
      try {
        const response: AxiosResponse<T> = await httpInstance.get(`${prefix}${url}`, {
          ...config,
          params: { ...(config?.params ?? {}), ...(params ?? {}) },
        })

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // POST request
    async post<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response: AxiosResponse<T> = await httpInstance.post(`${prefix}${url}`, data, config)
        return response.data
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // POST request with full response
    async postWithResponse<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
      try {
        const response: AxiosResponse<T> = await httpInstance.post(`${prefix}${url}`, data, config)

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // PUT request
    async put<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
      try {
        const response: AxiosResponse<T> = await httpInstance.put(`${prefix}${url}`, data, config)

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // PATCH request
    async patch<T>(url: string, data?: RequestBody, config?: AxiosRequestConfig): Promise<IResponse<T>> {
      try {
        const response: AxiosResponse<T> = await httpInstance.patch(`${prefix}${url}`, data, config)

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // DELETE request
    async delete<T>(url: string, params?: DeleteParams): Promise<IResponse<T>> {
      try {
        const response: AxiosResponse<T> = await httpInstance.delete(`${prefix}${url}`, { params })

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // Upload file
    async upload<T>(url: string, file: File, additionalData?: Record<string, unknown>): Promise<IResponse<T>> {
      try {
        const formData = new FormData()
        formData.append("file", file)

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value))
          })
        }

        const response: AxiosResponse<T> = await httpInstance.post(`${prefix}${url}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    // Generic methods with better typing
    async postGeneric<TResponse, TRequest = unknown>(
      url: string,
      data?: TRequest,
      config?: AxiosRequestConfig,
    ): Promise<IResponse<TResponse>> {
      try {
        const response: AxiosResponse<TResponse> = await httpInstance.post(`${prefix}${url}`, data, config)

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    },

    async putGeneric<TResponse, TRequest = unknown>(
      url: string,
      data?: TRequest,
      config?: AxiosRequestConfig,
    ): Promise<IResponse<TResponse>> {
      try {
        const response: AxiosResponse<TResponse> = await httpInstance.put(`${prefix}${url}`, data, config)

        return {
          data: response.data,
          status: response.status,
          message: response.statusText,
          success: true,
        }
      } catch (error) {
        const apiError = handleError(error)
        throw apiError
      }
    }
  }
}

export default createBaseService
