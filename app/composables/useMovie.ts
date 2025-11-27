import { useDebounceFn } from '@vueuse/core'
import { DEFAULT_QUERY_PAGINATION } from '~/constants'
import type { IMovie, IMovieFilter } from '~/types/movie.type'
import type { IShowtimeTable } from '~/types/show-time.type'

export const useMovieFilterSync = createFilterSync<IMovieFilter>({
  defaults: {
    ...DEFAULT_QUERY_PAGINATION,
    searchName: '',
    genre: '',
    rangePrice: '',
    maxPrice: '',
    minPrice: '',
    orderBy: '',
    orderType: ''
  },
  mapping: {
    searchName: 'searchName',
    genre: 'genre',
    rangePrice: 'rangePrice',
    maxPrice: 'maxPrice',
    minPrice: 'minPrice',
    orderBy: 'orderBy',
    orderType: 'orderType'
  },
  coerce: {
    searchName: 'string',
    genre: 'string',
    rangePrice: 'string',
    maxPrice: 'string',
    minPrice: 'string',
    orderBy: 'number',
    orderType: 'string'
  },
  debounceMs: 400
})

const refreshCallback = ref<(() => Promise<void>) | null>(null)
const movies = ref<IMovie[]>([])
const totalRecords = ref(0)
const top10MostViewedMovies = ref<IMovie[]>([])
const showingMovies = ref<IMovie[]>([])
const upcomingMovies = ref<IMovie[]>([])
const movieDetail = ref<IMovie>({} as IMovie)
const movieShowtimeSetting = ref<IShowtimeTable>({} as IShowtimeTable)

export function useMovieData() {
  const { apply, filters } = useMovieFilterSync()

  const triggerRefresh = async (debounce: boolean = false) => {
    if (refreshCallback.value) {
      if (debounce) {
        const debouncedFn = useDebounceFn(refreshCallback.value, 400)
        debouncedFn()
      } else {
        await refreshCallback.value()
      }
    }
  }

  const applyWithRefresh = async (patch: Partial<IMovieFilter>, opts?: ApplyOptions) => {
    await apply(patch, opts)
    if (!opts?.skipRouter) {
      await triggerRefresh(opts?.debounce)
    }
  }

  const resetFilter = () => {
    applyWithRefresh(
      {
        ...DEFAULT_QUERY_PAGINATION,
        searchName: '',
        genre: '',
        rangePrice: '',
        maxPrice: '',
        minPrice: '',
        orderBy: '',
        orderType: ''
      },
      { resetPage: true }
    )
  }

  return {
    // State
    filters,
    movies,
    totalRecords,
    top10MostViewedMovies,
    movieDetail,
    showingMovies,
    upcomingMovies,
    movieShowtimeSetting,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    },
    resetFilter
  }
}
