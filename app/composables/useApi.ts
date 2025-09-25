// API composables following Nuxt best practices
// Universal API composable - handles all types of API calls
export function useUniversalApi<T = unknown>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: Record<string, unknown> | FormData | string
    params?: Record<string, string | number | boolean>
    headers?: Record<string, string>
    immediate?: boolean
    pagination?: {
      enabled: boolean
      page?: Ref<number>
      limit?: Ref<number>
      pageParam?: string
      limitParam?: string
    }
    cache?: {
      enabled: boolean
      ttl?: number
      key?: string
    }
    transform?: (data: unknown) => T
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {}
) {
  const {
    method = 'GET',
    body,
    params = {},
    headers = {},
    immediate = true,
    pagination = { enabled: false },
    cache = { enabled: false },
    transform,
    onSuccess,
    onError
  } = options

  // Reactive state
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

  // Pagination state
  const currentPage = pagination.page || ref(1)
  const limit = pagination.limit || ref(10)
  const total = ref(0)
  const totalPages = ref(0)

  // Cache state
  const cacheMap = new Map<string, { data: unknown; timestamp: number }>()

  // Helper functions
  const isExpired = (timestamp: number) => {
    return Date.now() - timestamp > (cache.ttl || 5 * 60 * 1000)
  }

  const buildUrl = (page?: number) => {
    let finalUrl = url
    const urlParams = new URLSearchParams()

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value))
      }
    })

    // Add pagination parameters
    if (pagination.enabled) {
      const pageNum = page || currentPage.value
      const limitNum = limit.value

      urlParams.append(
        pagination.pageParam || 'page',
        String(pageNum)
      )
      urlParams.append(
        pagination.limitParam || 'limit',
        String(limitNum)
      )
    }

    if (urlParams.toString()) {
      finalUrl += (url.includes('?') ? '&' : '?') + urlParams.toString()
    }

    return finalUrl
  }

  const getCacheKey = (page?: number) => {
    const baseKey = cache.key || `${method}:${url}`
    const paramsKey = JSON.stringify({ ...params, page: page || currentPage.value })
    return `${baseKey}:${paramsKey}`
  }

  const execute = async (page?: number) => {
    // Reset state
    error.value = null
    status.value = 'pending'
    pending.value = true

    try {
      const finalUrl = buildUrl(page)
      const cacheKey = getCacheKey(page)

      // Check cache for GET requests
      if (cache.enabled && method === 'GET' && cacheMap.has(cacheKey)) {
        const cached = cacheMap.get(cacheKey)!
        if (!isExpired(cached.timestamp)) {
          data.value = cached.data as T
          status.value = 'success'
          onSuccess?.(cached.data as T)
          return cached.data as T
        }
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }

      // Add body for non-GET requests
      if (method !== 'GET' && body) {
        requestOptions.body = JSON.stringify(body)
      }

      // Make the request
      const response = await fetch(finalUrl, requestOptions)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Transform data if needed
      const transformedData = transform ? transform(result) : result

      // Handle pagination response
      if (pagination.enabled && result.data && typeof result.total === 'number') {
        data.value = transformedData.data || transformedData
        total.value = result.total
        totalPages.value = result.totalPages || Math.ceil(result.total / limit.value)
        currentPage.value = result.page || currentPage.value
      } else {
        data.value = transformedData
      }

      // Cache the result for GET requests
      if (cache.enabled && method === 'GET') {
        cacheMap.set(cacheKey, {
          data: transformedData,
          timestamp: Date.now()
        })
      }

      status.value = 'success'
      onSuccess?.(transformedData)

      return transformedData

    } catch (err) {
      error.value = err as Error
      status.value = 'error'
      onError?.(err as Error)
      throw err
    } finally {
      pending.value = false
    }
  }

  // Pagination helpers
  const nextPage = () => {
    if (pagination.enabled && currentPage.value < totalPages.value) {
      currentPage.value++
      execute()
    }
  }

  const prevPage = () => {
    if (pagination.enabled && currentPage.value > 1) {
      currentPage.value--
      execute()
    }
  }

  const goToPage = (page: number) => {
    if (pagination.enabled && page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      execute()
    }
  }

  // Cache helpers
  const invalidateCache = () => {
    cacheMap.clear()
  }

  const refresh = () => execute()

  // Auto-execute if immediate
  if (immediate) {
    execute()
  }

  return {
    // Data
    data: readonly(data),
    error: readonly(error),
    pending: readonly(pending),
    status: readonly(status),

    // Pagination (only available when pagination.enabled = true)
    ...(pagination.enabled && {
      total: readonly(total),
      totalPages: readonly(totalPages),
      currentPage,
      limit,
      nextPage,
      prevPage,
      goToPage
    }),

    // Methods
    execute,
    refresh,
    invalidateCache
  }
}

// Generic API composable with reactive state
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    immediate?: boolean
    resetOnExecute?: boolean
    transform?: (data: T) => unknown
  } = {}
) {
  const { immediate = true, resetOnExecute = true, transform } = options

  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

  const execute = async () => {
    if (resetOnExecute) {
      error.value = null
      data.value = null
    }

    pending.value = true
    status.value = 'pending'

    try {
      const result = await apiCall()
      data.value = transform ? transform(result) : result
      status.value = 'success'
      return result
    } catch (err) {
      error.value = err as Error
      status.value = 'error'
      throw err
    } finally {
      pending.value = false
    }
  }

  const refresh = () => execute()

  if (immediate) {
    execute()
  }

  return {
    data: readonly(data),
    error: readonly(error),
    pending: readonly(pending),
    status: readonly(status),
    execute,
    refresh
  }
}

// Paginated data composable
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>,
  options: {
    page?: Ref<number>
    limit?: Ref<number>
    immediate?: boolean
  } = {}
) {
  const currentPage = options.page || ref(1)
  const limit = options.limit || ref(10)
  const immediate = options.immediate ?? true

  const data = ref<T[]>([])
  const total = ref(0)
  const totalPages = ref(0)
  const error = ref<Error | null>(null)
  const pending = ref(false)

  const fetchPage = async (page: number = currentPage.value) => {
    pending.value = true
    error.value = null

    try {
      const result = await apiCall(page, limit.value)
      data.value = result.data
      total.value = result.total
      totalPages.value = result.totalPages
      currentPage.value = result.page
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      pending.value = false
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchPage()
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchPage()
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchPage()
    }
  }

  if (immediate) {
    fetchPage()
  }

  return {
    data: readonly(data),
    total: readonly(total),
    totalPages: readonly(totalPages),
    currentPage,
    limit,
    error: readonly(error),
    pending: readonly(pending),
    fetchPage,
    nextPage,
    prevPage,
    goToPage
  }
}

// Form submission composable
export function useFormSubmit<T, R>(
  submitFn: (data: T) => Promise<R>,
  options: {
    onSuccess?: (result: R) => void
    onError?: (error: Error) => void
    resetOnSuccess?: boolean
  } = {}
) {
  const { onSuccess, onError, resetOnSuccess = false } = options

  const data = ref<T>({} as T)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  const success = ref(false)

  const submit = async () => {
    pending.value = true
    error.value = null
    success.value = false

    try {
      const result = await submitFn(data.value)
      success.value = true
      onSuccess?.(result)

      if (resetOnSuccess) {
        data.value = {} as T
      }

      return result
    } catch (err) {
      error.value = err as Error
      onError?.(err as Error)
      throw err
    } finally {
      pending.value = false
    }
  }

  const reset = () => {
    data.value = {} as T
    error.value = null
    success.value = false
  }

  return {
    data,
    error: readonly(error),
    pending: readonly(pending),
    success: readonly(success),
    submit,
    reset
  }
}

// Cache composable for API calls
export function useApiCache<T>(
  key: string,
  apiCall: () => Promise<T>,
  options: {
    ttl?: number // Time to live in milliseconds
    immediate?: boolean
  } = {}
) {
  const { ttl = 5 * 60 * 1000, immediate = true } = options // 5 minutes default

  const cache = new Map<string, { data: T; timestamp: number }>()

  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const pending = ref(false)

  const isExpired = (timestamp: number) => {
    return Date.now() - timestamp > ttl
  }

  const fetch = async (useCache = true) => {
    // Check cache first
    if (useCache && cache.has(key)) {
      const cached = cache.get(key)!
      if (!isExpired(cached.timestamp)) {
        data.value = cached.data
        return cached.data
      }
    }

    pending.value = true
    error.value = null

    try {
      const result = await apiCall()

      // Cache the result
      cache.set(key, {
        data: result,
        timestamp: Date.now()
      })

      data.value = result
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      pending.value = false
    }
  }

  const invalidate = () => {
    cache.delete(key)
  }

  const refresh = () => fetch(false)

  if (immediate) {
    fetch()
  }

  return {
    data: readonly(data),
    error: readonly(error),
    pending: readonly(pending),
    fetch,
    refresh,
    invalidate
  }
}
