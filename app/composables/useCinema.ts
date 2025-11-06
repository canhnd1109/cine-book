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
const allCinemas = ref<ICinema[]>([])
const totalRecords = ref(0)
const roomsOfCinema = ref<{ roomId: string; name: string }[]>([])

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
    const { data } = await useAsyncData('rooms-list', async () => {
      const res = await apiPublic.fetchRooms(cinameDetail.value.id)
      return res.value ?? []
    })
    rooms.value = data.value ?? []
  }

  const fetchAllCinemas = async () => {
    const { data, refresh, execute } = useAsyncData(
      'all-cinemas',
      async () => {
        const res = await apiPublic.fetchAllCinemas()
        return res.value ?? []
      },
      {
        server: true,
        lazy: true,
        default: () => []
      }
    )

    if (!data.value || data.value.length === 0) {
      await execute()
    } else {
      await refresh()
    }

    allCinemas.value = data.value ?? []
  }

  const fetchRoomsOfCinema = async (cinemaId: string) => {
    if (!cinemaId) {
      roomsOfCinema.value = []
      return
    }

    const { data, execute } = useAsyncData(
      `room-of:${cinemaId}`,
      async () => {
        const { value } = await apiPublic.fetchRoomsOfCinema(cinemaId)

        return Array.isArray(value) ? value : []
      },
      {
        getCachedData: key => {
          const nuxtApp = useNuxtApp()
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        },
        immediate: false
      }
    )

    await execute()
    roomsOfCinema.value = data.value ?? []
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
    allCinemas,
    roomsOfCinema,

    // Method
    apply: applyWithRefresh,
    setRefreshCallback: (cb: () => Promise<void>) => {
      refreshCallback.value = cb
    },
    restSeat,
    fetchRooms,
    fetchAllCinemas,
    fetchRoomsOfCinema
  }
}
