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
  const { data, pending, error, refresh } = useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/filter', {
    ...createBaseFetchOptions(),
    key: 'top-10-most-viewed-movies',
    query: { orderBy: '4' }
  })

  return {
    data,
    pending,
    error,
    refresh
  }
}

/**
 * Hook để fetch showing movies
 */
export const useFetchShowingMovies = () => {
  const { data, pending, error, refresh } = useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/showing', {
    ...createBaseFetchOptions(),
    key: 'showing-movies'
  })
  return {
    data,
    pending,
    error,
    refresh
  }
}

/**
 * Hook để fetch upcoming movies
 */
export const useFetchUpcomingMovies = () => {
  const { data, pending, error, refresh } = useFetch<MovieApiResponse<IMovie[]>>('/public-api/movie/upcoming', {
    ...createBaseFetchOptions(),
    key: 'upcoming-movies'
  })
  return {
    data,
    pending,
    error,
    refresh
  }
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

/**
 * Hook để fetch movies by cinema and day
 * @param cinemaId - ID của rạp chiếu
 * @param startDate - Ngày bắt đầu đã được format (yyyy-MM-dd)
 */
export const useFetchMoviesByCinemaByDay = (cinemaId: string | Ref<string>, startDate: string | Ref<string>) => {
  const id = computed(() => unref(cinemaId))
  const date = computed(() => unref(startDate))

  return useFetch<IMovieByDay[]>(
    computed(() => `/public-api/cinema/${id.value}/movies`),
    {
      ...createBaseFetchOptions<IMovieByDay[]>({
        immediate: true,
        key: computed(() => `movies-cinema-${id.value}-${date.value}`),
        query: computed(() => ({ startDate: date.value })),
        watch: [id, date],
        transform: (data: unknown) => {
          const response = data as { value?: IMovieByDay[] }
          return response?.value ?? []
        }
      })
    }
  )
}
