import type { NitroFetchRequest } from 'nitropack'
import { useNuxtApp } from '#app'
import type { ExtendedFetchOptions } from '~/types/http.type'

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

  async get<T, Q extends Record<string, string | number | boolean | null | undefined> = Record<string, never>>(
    url: string,
    params?: Q
  ): Promise<T> {
    return this.handleRequest<T>(url, { method: 'get', query: params })
  }

  async post<T, B extends Record<string, unknown> | FormData | string | undefined = undefined>(
    url: string,
    body?: B,
    config?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.handleRequest<T>(url, { method: 'post', body, ...config })
  }

  async put<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
    return this.handleRequest<T>(url, { method: 'put', body })
  }

  async patch<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
    return this.handleRequest<T>(url, { method: 'patch', body })
  }

  async delete<T, Q extends Record<string, string | number | boolean | null | undefined> = Record<string, never>>(
    url: string,
    params?: Q
  ): Promise<T> {
    return this.handleRequest<T>(url, { method: 'delete', query: params })
  }
}
