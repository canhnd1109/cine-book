import type { NitroFetchRequest } from 'nitropack'
import { useNuxtApp } from '#app'
import type { ExtendedFetchOptions } from '~/types/http.type'

type QueryParams = Record<string, string | number | boolean | string[] | number[] | undefined | any>
type DeleteParams = Record<string, string | number | boolean | undefined>
type RequestBody = Record<string, unknown> | FormData | string | any

export default class BaseService {
  prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private get api() {
    return useNuxtApp().$http as <T>(url: NitroFetchRequest, options?: ExtendedFetchOptions) => Promise<T>
  }

  private async handleRequest<T>(url: string, options: ExtendedFetchOptions): Promise<T> {
    try {
      return await this.api<T>(`${this.prefix}${url}`, options)
    } catch (error: any) {
      throw {
        error: true,
        data: error?.data || null
      }
    }
  }

  async get<T>(url: string, params?: QueryParams): Promise<T> {
    return this.handleRequest<T>(url, { method: 'get', query: params })
  }

  async post<T>(
    url: string,
    body?: RequestBody,
    config?: { headers?: Record<string, string>; params?: Record<string, any> }
  ): Promise<T> {
    return this.handleRequest<T>(url, { method: 'post', body, ...config })
  }

  // async put<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
  //   return this.handleRequest<T>(url, { method: 'put', body })
  // }

  async put<T>(url: string, body?: RequestBody, config?: { headers?: Record<string, string> }): Promise<T> {
    return this.handleRequest<T>(url, { method: 'put', body, ...config })
  }
  async patch<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
    return this.handleRequest<T>(url, { method: 'patch', body })
  }

  async delete<T>(url: string, params?: DeleteParams): Promise<T> {
    return this.handleRequest<T>(url, { method: 'delete', query: params })
  }
}
