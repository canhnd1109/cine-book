import { useDebounceFn } from '@vueuse/core'
import { DEFAULT_QUERY_PAGINATION } from '~/constants'
import type { IMovie, IMovieFilter } from '~/types/movie.type'

export const useMovieFilterSync = createFilterSync<IMovieFilter>({
  defaults: {
    ...DEFAULT_QUERY_PAGINATION,
    searchName: '',
    genre: '',
    maxPrice: '',
    minPrice: '',
    orderBy: '',
    orderType: ''
  },
  mapping: {
    searchName: 'searchName',
    genre: 'genre',
    maxPrice: 'maxPrice',
    minPrice: 'minPrice',
    orderBy: 'orderBy',
    orderType: 'orderType'
  },
  coerce: {
    searchName: 'string',
    genre: 'string',
    maxPrice: 'string',
    minPrice: 'string',
    orderBy: 'string',
    orderType: 'string'
  },
  debounceMs: 400
})

const refreshCallback = ref<(() => Promise<void>) | null>(null)
const movies = ref<IMovie[]>([])
const totalRecords = ref(0)

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

  return {
    // State
    filters,
    movies,
    totalRecords,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    }
  }
}
