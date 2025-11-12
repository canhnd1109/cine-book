import type { IMovie, IMovieByDay } from '~/types/movie.type'

import type { UseFetchOptions } from 'nuxt/app'

export interface MovieApiResponse<T = IMovie[]> {
  content: T
  totalPages?: number
  totalElements?: number
}

const createBaseFetchOptions = <T = IMovie[]>(options?: Partial<UseFetchOptions<T>>) => {
  const runtimeConfig = useRuntimeConfig()

  return {
    baseURL: runtimeConfig.public.baseApiUrl,
    headers: {
      'App-Code': 'cine-book',
      Accept: 'application/json'
    },
    immediate: false,
    server: false,
    transform: (data: unknown) => (data as { value: T }).value,
    ...options
  }
}

/**
 * Hook để fetch top 10 most viewed movies
 */
export const useFetchTopMovies = () => {
  return useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/filter', {
    ...createBaseFetchOptions(),
    key: 'top-10-most-viewed-movies',
    query: { orderBy: '4' }
  })
}

/**
 * Hook để fetch showing movies
 */
export const useFetchShowingMovies = () => {
  return useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/showing', {
    ...createBaseFetchOptions(),
    key: 'showing-movies'
  })
}

/**
 * Hook để fetch upcoming movies
 */
export const useFetchUpcomingMovies = () => {
  return useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/upcoming', {
    ...createBaseFetchOptions(),
    key: 'upcoming-movies'
  })
}

/**
 * Hook để fetch movie detail by ID
 */
export const useFetchMovieDetail = (movieId: string | Ref<string>) => {
  const id = unref(movieId)
  return useFetch<MovieApiResponse<IMovie[]>>(`/public-api/movie/${id}`, {
    ...createBaseFetchOptions(),
    key: `movie-detail-${id}`,
    watch: [() => unref(movieId)]
  })
}

/**
 * Hook để fetch movies với custom filter
 */
export const useFetchMoviesWithFilter = (filter: Ref<Record<string, string | number>> | Record<string, string | number>) => {
  return useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/filter', {
    ...createBaseFetchOptions(),
    key: 'movies-filtered',
    query: filter,
    watch: [filter]
  })
}

/**
 * Hook để fetch movies by day
 */
export const useFetchMoviesByDay = (day: string | Ref<string>) => {
  const selectedDay = computed(() => unref(day))

  return useFetch<IMovieByDay[]>(
    computed(() => {
      return `/public-api/movie/by-date/${selectedDay.value}`
    }),
    {
      ...createBaseFetchOptions<IMovieByDay[]>({
        immediate: true,
        key: computed(() => `movies-by-day-${selectedDay.value}`),
        watch: [selectedDay],
        transform: (data: unknown) => {
          const response = data as { value?: IMovieByDay[] }
          return response?.value ?? []
        }
      })
    }
  )
}
