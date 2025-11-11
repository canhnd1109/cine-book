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
    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(
        `${runtimeConfig.public.baseApiUrl}/public-api/movie/filter`,
        {
          method: 'GET',
          query,
          headers: baseHeaders
        }
      )
      return response
    } catch (error) {
      console.error('[usePublicMovies] Error fetching movies:', error)
      return null
    }
  }

  /**
   * Fetch showing movies
   */
  const fetchShowingMovies = async () => {
    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(
        `${runtimeConfig.public.baseApiUrl}/public-api/movie/showing`,
        {
          method: 'GET',
          headers: baseHeaders
        }
      )
      return response
    } catch (error) {
      console.error('[usePublicMovies] Error fetching showing movies:', error)
      return null
    }
  }

  /**
   * Fetch upcoming movies
   */
  const fetchUpcomingMovies = async () => {
    try {
      const response = await $fetch<IResponseData<IResponsePagination<IMovie[]>>>(
        `${runtimeConfig.public.baseApiUrl}/public-api/movie/upcoming`,
        {
          method: 'GET',
          headers: baseHeaders
        }
      )
      return response
    } catch (error) {
      console.error('[usePublicMovies] Error fetching upcoming movies:', error)
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
      return response
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
