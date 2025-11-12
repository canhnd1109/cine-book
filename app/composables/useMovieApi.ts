import type { IMovie } from '~/types/movie.type'
import type { UseFetchOptions } from 'nuxt/app'

/**
 * Composable để tạo useFetch config cho public movie APIs
 * Tất cả config được centralize tại đây
 */

export interface MovieApiResponse {
  content: IMovie[]
  totalPages?: number
  totalElements?: number
}

/**
 * Base config cho tất cả public movie API calls
 */
const createBaseFetchOptions = (endpoint: string, options?: Partial<UseFetchOptions<MovieApiResponse>>) => {
  const runtimeConfig = useRuntimeConfig()

  return {
    baseURL: runtimeConfig.public.baseApiUrl,
    headers: {
      'App-Code': 'cine-book',
      Accept: 'application/json'
    },
    immediate: false, // Không fetch ngay, đợi manual call
    server: false, // Chỉ fetch trên client để tránh SSR issues
    transform: (data: unknown) => (data as { value?: MovieApiResponse })?.value,
    ...options
  } as UseFetchOptions<MovieApiResponse>
}

/**
 * Hook để fetch top 10 most viewed movies
 */
export const useFetchTopMovies = () => {
  return useFetch('/public-api/movie/filter', {
    ...createBaseFetchOptions('/public-api/movie/filter'),
    key: 'top-10-most-viewed-movies',
    query: { orderBy: '4' }
  })
}

/**
 * Hook để fetch showing movies
 */
export const useFetchShowingMovies = () => {
  return useFetch('/public-api/movie/showing', {
    ...createBaseFetchOptions('/public-api/movie/showing'),
    key: 'showing-movies'
  })
}

/**
 * Hook để fetch upcoming movies
 */
export const useFetchUpcomingMovies = () => {
  return useFetch('/public-api/movie/upcoming', {
    ...createBaseFetchOptions('/public-api/movie/upcoming'),
    key: 'upcoming-movies'
  })
}

/**
 * Hook để fetch movie detail by ID
 */
export const useFetchMovieDetail = (movieId: string | Ref<string>) => {
  const id = unref(movieId)
  return useFetch(`/public-api/movie/${id}`, {
    ...createBaseFetchOptions(`/public-api/movie/${id}`),
    key: `movie-detail-${id}`,
    watch: [() => unref(movieId)] // Re-fetch when movieId changes
  })
}

/**
 * Hook để fetch movies với custom filter
 */
export const useFetchMoviesWithFilter = (filter: Ref<Record<string, string | number>> | Record<string, string | number>) => {
  return useFetch('/public-api/movie/filter', {
    ...createBaseFetchOptions('/public-api/movie/filter'),
    key: 'movies-filtered',
    query: filter,
    watch: [filter] // Re-fetch when filter changes
  })
}
