import { useDebounceFn } from '@vueuse/core'
import { apiPublic } from '~/services'
import type { ICinema, ICinemaFilter, IRoom } from '~/types/cinema.type'

const cinameDetail = ref<ICinema>({} as ICinema)
const rooms = ref<IRoom[]>([])

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

  const typeSeat = ref('')
  const priceSeat = ref('')
  const restSeat = () => {
    typeSeat.value = ''
    priceSeat.value = ''
  }

  const fetchRooms = async () => {
    const {
      data,
      pending: isFetching,
      refresh
    } = await useAsyncData('rooms-list', async () => {
      const res = await apiPublic.fetchRooms(cinameDetail.value.id)
      return res.value ?? []
    })
    rooms.value = data.value ?? []
    console.log('🚀 ~ fetchRooms ~  rooms.value:', rooms.value)
  }
  return {
    // State
    filters,
    cinemas,
    totalRecords,
    cinameDetail,
    typeSeat,
    priceSeat,
    rooms,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    },
    restSeat,
    fetchRooms
  }
}
