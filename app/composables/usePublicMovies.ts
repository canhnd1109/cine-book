import type { IMovie } from '~/types/movie.type'
import type { IResponseData, IResponsePagination } from '~/types/response.type'

/**
 * Composable để fetch public movies API
 * Sử dụng $fetch trực tiếp để tương thích với SSR trên Vercel
 */
export const usePublicMovies = () => {
  const runtimeConfig = useRuntimeConfig()

  const baseHeaders = {
    'App-Code': 'cine-book',
    Accept: 'application/json'
  }

  /**
   * Fetch movies với filter
   */
  const fetchMovies = async (query?: Record<string, string | number>) => {
    const url = `${runtimeConfig.public.baseApiUrl}/public-api/movie/filter`
    console.log('[usePublicMovies] Fetching from:', url, 'with query:', query)

    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(url, {
        method: 'GET',
        query,
        headers: baseHeaders
      })
      console.log('[usePublicMovies] Response:', response)
      // Unwrap response.value để tương thích với useAsyncData
      return response.value
    } catch (error: any) {
      console.error('[usePublicMovies] Error fetching movies:', {
        message: error?.message,
        statusCode: error?.statusCode,
        data: error?.data,
        url
      })
      return null
    }
  }

  /**
   * Fetch showing movies
   */
  const fetchShowingMovies = async () => {
    const url = `${runtimeConfig.public.baseApiUrl}/public-api/movie/showing`
    console.log('[usePublicMovies] Fetching showing movies from:', url)

    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(url, {
        method: 'GET',
        headers: baseHeaders
      })
      console.log('[usePublicMovies] Showing response:', response)
      // Unwrap response.value để tương thích với useAsyncData
      return response.value
    } catch (error: any) {
      console.error('[usePublicMovies] Error fetching showing movies:', {
        message: error?.message,
        statusCode: error?.statusCode,
        data: error?.data,
        url
      })
      return null
    }
  }

  /**
   * Fetch upcoming movies
   */
  const fetchUpcomingMovies = async () => {
    const url = `${runtimeConfig.public.baseApiUrl}/public-api/movie/upcoming`
    console.log('[usePublicMovies] Fetching upcoming movies from:', url)

    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(url, {
        method: 'GET',
        headers: baseHeaders
      })
      console.log('[usePublicMovies] Upcoming response:', response)
      // Unwrap response.value để tương thích với useAsyncData
      return response.value
    } catch (error: any) {
      console.error('[usePublicMovies] Error fetching upcoming movies:', {
        message: error?.message,
        statusCode: error?.statusCode,
        data: error?.data,
        url
      })
      return null
    }
  }

  /**
   * Fetch movie detail
   */
  const fetchMovieDetail = async (movieId: string) => {
    try {
      const response = await $fetch<IResponseData<IMovie>>(`${runtimeConfig.public.baseApiUrl}/public-api/movie/${movieId}`, {
        method: 'GET',
        headers: baseHeaders
      })
      // Unwrap response.value để tương thích với useAsyncData
      return response.value
    } catch (error) {
      console.error('[usePublicMovies] Error fetching movie detail:', error)
      return null
    }
  }

  return {
    fetchMovies,
    fetchShowingMovies,
    fetchUpcomingMovies,
    fetchMovieDetail
  }
}
