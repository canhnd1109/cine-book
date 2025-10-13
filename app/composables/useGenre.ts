import { useDebounceFn } from '@vueuse/core'
import type { IGenre, IGenreFilter } from '~/types/genre.type'

export const useGenreFilterSync = createFilterSync<IGenreFilter>({
  defaults: {
    search: ''
  },
  mapping: {
    search: 'search'
  },
  coerce: {
    search: 'string'
  },
  debounceMs: 400
})

const refreshCallback = ref<(() => Promise<void>) | null>(null)
const genres = ref<IGenre[]>([])

export function useGenreData() {
  const { apply, filters } = useGenreFilterSync()

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

  const applyWithRefresh = async (patch: Partial<IGenreFilter>, opts?: ApplyOptions) => {
    await apply(patch, opts)
    if (!opts?.skipRouter) {
      await triggerRefresh(opts?.debounce)
    }
  }

  return {
    // State
    filters,
    genres,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    }
  }
}
