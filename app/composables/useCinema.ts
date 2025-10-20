import { useDebounceFn } from '@vueuse/core'
import type { ICinema, ICinemaFilter } from '~/types/cinema.type'

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
const cinemas = ref<ICinema[]>([])
const totalRecords = ref(0)

export function useCinemaData() {
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

  // TODO:CINEMA DETAIL
  const cinameDetail = ref<ICinema>({} as ICinema)

  return {
    // State
    filters,
    cinemas,
    totalRecords,
    cinameDetail,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    }
  }
}
