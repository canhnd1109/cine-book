import { useDebounceFn } from '@vueuse/core'
import type { ICinemaFilter } from '~/types/cinema.type'

export const useCinemaFilterSync = createFilterSync<ICinemaFilter>({
  defaults: {
    keyWord: ''
  },
  mapping: {
    keyWord: 'keyWord'
  },
  coerce: {
    keyWord: 'string'
  },
  debounceMs: 400
})

const refreshCallback = ref<(() => Promise<void>) | null>(null)

export function useGenreData() {
  const { apply, filters } = useCinemaFilterSync()

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

  const applyWithRefresh = async (patch: Partial<ICinemaFilter>, opts?: ApplyOptions) => {
    await apply(patch, opts)
    if (!opts?.skipRouter) {
      await triggerRefresh(opts?.debounce)
    }
  }

  return {
    // State
    filters,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    }
  }
}
