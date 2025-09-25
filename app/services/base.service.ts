import type { NitroFetchRequest } from 'nitropack'
import { useNuxtApp } from '#app'
import type { ExtendedFetchOptions } from '~/types/http.type'
type RequestBody = Record<string, unknown> | FormData | string

export default class BaseService {
  prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private get api() {
    return useNuxtApp().$http as <T>(url: NitroFetchRequest, options?: ExtendedFetchOptions) => Promise<T>
  }

  async get<T, Q extends Record<string, string | number | boolean | null | undefined> = Record<string, never>>(
    url: string,
    params?: Q
  ): Promise<T> {
    return this.api<T>(`${this.prefix}${url}`, {
      method: 'get',
      query: params
    })
  }

  async post<T, B extends Record<string, unknown> | FormData | string | undefined = undefined>(
    url: string,
    body?: B,
    config?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.api<T>(`${this.prefix}${url}`, {
      method: 'post',
      body,
      ...config
    })
  }

  async put<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
    return this.api<T>(`${this.prefix}${url}`, {
      method: 'put',
      body
    })
  }

  async patch<T, B extends Record<string, unknown> | FormData | undefined = undefined>(url: string, body?: B): Promise<T> {
    return this.api<T>(`${this.prefix}${url}`, {
      method: 'patch',
      body
    })
  }

  async delete<T, Q extends Record<string, string | number | boolean | null | undefined> = Record<string, never>>(
    url: string,
    params?: Q
  ): Promise<T> {
    return this.api<T>(`${this.prefix}${url}`, {
      method: 'delete',
      query: params
    })
  }
}
